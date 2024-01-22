import json
from behave import then
from tests.utils import is_dict_in_dict, load_text


@then(u'I expect the last response status to be "{expected_status_code}"')
def step_then_response_status(context, expected_status_code: str):
    assert context.api["status_code"] == int(expected_status_code)


@then(u'I expect the last response to have a JSON body matching the following rules')
def step_then_response_body(context):
    expected_body = json.loads(load_text(context))
    response = context.api["response"]
    assert response == expected_body


@then(u'I expect the last response to be a JSON containing the following elements')
def step_then_partial_response_body(context):
    expected_body = json.loads(load_text(context))
    response = context.api["response"]
    if isinstance(response, dict):
        assert is_dict_in_dict(expected_body, response) is True, f"Expected {expected_body} not in {response}"
        return

    counter = 0
    for item in response:
        assert is_dict_in_dict(expected_body[counter], item) is True, f"Expected {expected_body} not in {response}"
        counter += 1
