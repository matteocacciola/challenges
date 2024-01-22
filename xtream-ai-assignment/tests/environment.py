from behave import use_fixture
from tests.fixtures import set_http_client, reset, reset_request


def before_all(context):
    use_fixture(set_http_client, context)


def before_scenario(context, scenario):
    use_fixture(reset_request, context)


def after_all(context):
    use_fixture(reset, context)
