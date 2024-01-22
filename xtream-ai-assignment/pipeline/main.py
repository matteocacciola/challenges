import sys
import getopt
from typing import Any
from enum import Enum as BaseEnum, EnumMeta
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib


class MetaEnum(EnumMeta):
    """
    Enables the use of the `in` operator for enums.
    For example:
    if provider not in Provider:
        raise ValueError("invalid provider")
    """

    def __contains__(cls, item):
        try:
            cls(item)  # pylint: disable=E1120
        except ValueError:
            return False
        return True


class Enum(BaseEnum, metaclass=MetaEnum):
    def __str__(self):
        return self.value


class ClassifierType(Enum):
    """
    The list of providers that can be used to classify the churn target
    """

    MLP = "mlp"
    RF = "rf"


# definition of functions
def save_model(model, filename: str | None = "model.joblib", debug: bool | None = False):
    joblib.dump(model, filename)
    if debug:
        print(f"Model saved as {filename}")


def load_model(filename: str | None = "model.joblib"):
    return joblib.load(filename)


def load_file(url: str) -> pd.DataFrame:
    return pd.read_csv(url)


def train_model(x_tr, y_tr, classifier_type: ClassifierType = ClassifierType.RF) -> Pipeline:
    if classifier_type == ClassifierType.RF:
        classifier = RandomForestClassifier(random_state=42)
    elif classifier_type == ClassifierType.MLP:
        classifier = MLPClassifier(
            hidden_layer_sizes=(64, 20), max_iter=1000, random_state=42, activation="logistic", learning_rate="adaptive"
        )
    else:
        raise ValueError("Invalid classifier type. Supported types: RandomForest, MLP")
    # Define the pipeline
    pipeline = Pipeline([("imputer", SimpleImputer(strategy="mean")), ("clf", classifier)])
    # Train the model
    pipeline.fit(x_tr, y_tr)
    return pipeline


# Function to evaluate the model
def evaluate_model(model, x_tst: list, y_tst: list, debug: bool | None = False) -> tuple[Any, float, Any, str | dict]:
    # Make predictions
    y_pred = model.predict(x_tst)
    # Evaluate the model
    accuracy = accuracy_score(y_tst, y_pred)
    conf_matrix = confusion_matrix(y_tst, y_pred)
    class_report = classification_report(y_tst, y_pred)
    if debug:
        # Display results
        print(f"Accuracy: {accuracy:.2f}")
        print("\nConfusion Matrix:")
        print(conf_matrix)
        print("\nClassification Report:")
        print(class_report)
    return y_pred, accuracy, conf_matrix, class_report


def preprocess(panda_df: pd.DataFrame) -> pd.DataFrame:
    def labeling() -> pd.DataFrame:
        categorical_cols = panda_df.select_dtypes(include=["object"]).columns.tolist()
        # Encode categorical variables
        label_encoder = LabelEncoder()
        for col in categorical_cols:
            panda_df[col] = label_encoder.fit_transform(panda_df[col])
        return panda_df

    panda_df.dropna(subset=["education_level", "enrolled_university", "experience", "last_new_job"], inplace=True)
    panda_df.drop(["city", "enrollee_id", "relevent_experience"], axis=1, inplace=True)

    panda_df["gender"].fillna("Other", inplace=True)

    indices = panda_df["education_level"] == "Primary School"
    panda_df.loc[indices, "major_discipline"] = panda_df.loc[indices, "major_discipline"].fillna("No major")
    indices = panda_df["education_level"] == "High School"
    panda_df.loc[indices, "major_discipline"] = panda_df.loc[indices, "major_discipline"].fillna("Other")
    panda_df["major_discipline"].fillna("No major", inplace=True)

    indices = panda_df["experience"] == "<1"
    panda_df.loc[indices, "company_type"] = panda_df.loc[indices, "company_type"].fillna("No company type")
    panda_df.loc[indices, "company_size"] = panda_df.loc[indices, "company_size"].fillna("No company size")
    if len(panda_df["company_type"].mode().values) > 0:
        panda_df["company_type"].fillna(panda_df["company_type"].mode()[0], inplace=True)
    if len(panda_df["company_size"].mode().values) > 0:
        panda_df["company_size"].fillna(panda_df["company_size"].mode()[0], inplace=True)

    panda_df["experience"].replace(">20", "21", inplace=True)
    panda_df["experience"].replace("<1", "0", inplace=True)

    panda_df["last_new_job"].replace("never", "0", inplace=True)
    panda_df["last_new_job"].replace(">4", "5", inplace=True)

    panda_df["experience"] = panda_df["experience"].astype(int)
    panda_df["last_new_job"] = panda_df["last_new_job"].astype(int)
    panda_df["training_hours"] = panda_df["training_hours"].astype(float)

    return labeling()


def main(argv):
    input_file = output_file = classifier_type = ""
    if len(argv) == 0:
        print("main.py --data_path <data_path> --model_path <model_path> --classifier <RandomForest/MLP>")
        sys.exit(2)
    try:
        opts, _ = getopt.getopt(argv, "hi:o:c:", ["data_path=", "model_path=", "classifier="])
    except getopt.GetoptError:
        print("main.py --data_path <data_path> --model_path <model_path> --classifier <RandomForest/MLP>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("main.py --data_path <data_path> --model_path <model_path> --classifier <RandomForest/MLP>")
            sys.exit()
        elif opt in ("-i", "--data_path"):
            input_file = arg
        elif opt in ("-o", "--model_path"):
            output_file = arg
        elif opt in ("-c", "--classifier"):
            classifier_type = arg

    if not input_file:
        print("Input file path is mandatory.")
        sys.exit(2)

    if not output_file:
        print("Output file path is mandatory.")
        sys.exit(2)

    if not classifier_type:
        print("Classifier type is mandatory. Supported types: RandomForest, MLP.")
        sys.exit(2)

    if classifier_type not in ClassifierType:
        print("Invalid classifier type. Supported types: RandomForest, MLP.")
        sys.exit(2)

    # Load the dataset
    df = load_file(input_file)

    # Preprocess the data
    df = preprocess(df)

    # Split the data into features (X) and target variable (y)
    x = df.drop("target", axis=1)
    y = df["target"]

    # Split the data into training and testing sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    # Train the model
    trained_model = train_model(x_train, y_train, ClassifierType(classifier_type))

    # Evaluate the model
    y_pred = evaluate_model(trained_model, x_test, y_test)
    print(f"Predictions for new data: {y_pred}")

    # Save the model
    save_model(trained_model, output_file)


if __name__ == "__main__":
    main(sys.argv[1:])
