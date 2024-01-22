import os
from .config import Config
from .enums import Provider

__errors = []
_config = Config()

MODULE_PATH = os.path.dirname(os.path.abspath(__file__))
CURRENT_DIR = os.path.basename(MODULE_PATH)

PROVIDER = _config.get("EMPLOYEE_CHURN_SERVICE")
if not PROVIDER:
    __errors.append('"EMPLOYEE_CHURN_SERVICE" env key not defined.')
if PROVIDER not in Provider:
    __errors.append('"EMPLOYEE_CHURN_SERVICE" env key not valid.')

MODEL_PATH = os.path.join(MODULE_PATH, "..", f"models/{PROVIDER}_model.joblib")
if not os.path.exists(MODEL_PATH):
    __errors.append("Invalid classification provider model: the file does not exist.")

if len(__errors) > 0:
    raise ValueError(" ".join(__errors))
