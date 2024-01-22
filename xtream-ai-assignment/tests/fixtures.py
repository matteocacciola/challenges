from behave import fixture
from fastapi.testclient import TestClient

from main import app


# This fixtures creates a TestClient instance of the api_app FastAPI instance, by overriding dependencies with mocks.
@fixture
def set_http_client(context):
    context.client = TestClient(app=app)


@fixture
def init_placeholders(context):
    context.placeholders = {}


@fixture
def reset(context):
    context.client = None
    context.placeholders = {}


@fixture
def reset_request(context):
    context.api = {
        "headers": None,
        "response": None,
        "status_code": None,
    }
