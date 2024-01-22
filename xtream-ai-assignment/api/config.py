import os
from typing import Any


class Config:
    """
    Config class to load config from file and env vars.
    Give access to the whole configuration
    """

    @staticmethod
    def get(property_name: str, default: Any = None):
        return os.getenv(property_name, default)

    @staticmethod
    def get_int(property_name: str, default: int = 0) -> int:
        return int(Config.get(property_name, default))

    @staticmethod
    def get_bool(property_name: str, default: str = "0") -> bool:
        return bool(int(Config.get(property_name, default)))
