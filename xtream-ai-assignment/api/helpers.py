from pathlib import Path
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder

from .models import Candidate


class UtilsHelper:
    @staticmethod
    def load_joblib(path: str):
        """
        Function to load a joblib file from a s3 bucket or local directory.
        :param path: the path where the file is stored
        """
        with open(Path(path), "rb") as f:
            file = joblib.load(f)
        return file

    @staticmethod
    def preprocess(features: list[Candidate]) -> pd.DataFrame:
        def labeling() -> pd.DataFrame:
            categorical_cols = df.select_dtypes(include=["object"]).columns.tolist()
            # Encode categorical variables
            label_encoder = LabelEncoder()
            for col in categorical_cols:
                df[col] = label_encoder.fit_transform(df[col])
            return df

        df = pd.DataFrame([feature.model_dump() for feature in features])

        df.dropna(subset=["education_level", "enrolled_university", "experience", "last_new_job"], inplace=True)
        df.drop(["city", "enrollee_id", "relevent_experience"], axis=1, inplace=True)

        df["gender"].fillna("Other", inplace=True)
        indices = df["education_level"] == "Primary School"
        df.loc[indices, "major_discipline"] = df.loc[indices, "major_discipline"].fillna("No major")
        indices = df["education_level"] == "High School"
        df.loc[indices, "major_discipline"] = df.loc[indices, "major_discipline"].fillna("Other")
        df["major_discipline"].fillna("No major", inplace=True)

        indices = df["experience"] == "<1"
        df.loc[indices, "company_type"] = df.loc[indices, "company_type"].fillna("No company type")
        df.loc[indices, "company_size"] = df.loc[indices, "company_size"].fillna("No company size")
        if len(df["company_type"].mode().values) > 0:
            df["company_type"].fillna(df["company_type"].mode()[0], inplace=True)
        if len(df["company_size"].mode().values) > 0:
            df["company_size"].fillna(df["company_size"].mode()[0], inplace=True)

        df["experience"].replace(">20", "21", inplace=True)
        df["experience"].replace("<1", "0", inplace=True)

        df["last_new_job"].replace("never", "0", inplace=True)
        df["last_new_job"].replace(">4", "5", inplace=True)

        df["experience"] = df["experience"].astype(int)
        df["last_new_job"] = df["last_new_job"].astype(int)
        df["training_hours"] = df["training_hours"].astype(float)

        return labeling()
