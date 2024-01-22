from . import MODEL_PATH
from .models import Candidate, ChurnResult
from .helpers import UtilsHelper


class ClassificationProvider:
    """
    Class used to implement all the providers for the classification.
    """

    @staticmethod
    def classify(candidates: list[Candidate]) -> list[ChurnResult]:
        """
        Method used to detect the churn target of an employee starting from his / her features.
        :param candidates: the candidates to consider
        :return: the classified churn targets
        :rtype: int
        """
        model = UtilsHelper.load_joblib(MODEL_PATH)
        x = UtilsHelper.preprocess(candidates)
        targets = model.predict(x)

        return [ChurnResult(enrollee_id=candidates[i].enrollee_id, churn=target) for i, target in enumerate(targets)]
