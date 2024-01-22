from behave import when
from tests.utils import process_request


@when(u'I send a {http_verb} request to "{endpoint}" with body')
def step_when_generic_request_made_with_json_payload(context, http_verb: str, endpoint: str):
    if http_verb not in ["POST", "PUT"]:
        raise ValueError("This step only supports POST and PUT requests.")

    process_request(context, http_verb, endpoint)


@when(u'I send a {http_verb} request to "{endpoint}"')
def step_when_generic_request_made(context, http_verb: str, endpoint: str):
    if http_verb not in ["GET", "DELETE"]:
        raise ValueError("This step only supports GET and DELETE requests.")

    process_request(context, http_verb, endpoint)
