import json
from behave import given
from tests.utils import load_text


@given(u'I set the headers as')
def step_given_headers(context):
    context.api["headers"] = json.loads(load_text(context))
