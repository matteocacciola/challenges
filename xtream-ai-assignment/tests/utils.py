import json
from typing import Final
from fastapi import HTTPException
from starlette.testclient import TestClient


def process_request(context, http_verb, endpoint):
    client: Final[TestClient] = context.client
    headers = context.api["headers"]
    body = json.loads(load_text(context)) if context.text else None

    def get_api_response():
        if http_verb == "GET":
            return client.get(url=endpoint, headers=headers)
        if http_verb == "POST":
            return client.post(url=endpoint, headers=headers, json=body)
        if http_verb == "PUT":
            return client.put(url=endpoint, headers=headers, json=body)
        return client.delete(endpoint, headers=headers)

    try:
        response = get_api_response()
        status_code = response.status_code
        try:
            response = response.json()
        except UnicodeError:
            response = response.content
    except HTTPException as e:
        response = str(e)
        status_code = e.status_code

    # Save the response information in the context variable for the next step
    context.api["response"] = response
    context.api["status_code"] = status_code


def is_dict_in_dict(dict1: dict, dict2: dict) -> bool:
    for key, value in dict1.items():
        dict2_item = dict2.get(key)
        if isinstance(value, list):
            counter = 0
            for item in value:
                result = (
                    is_dict_in_dict(item, dict2_item[counter])
                    if isinstance(item, dict)
                    else sorted(item) == sorted(dict2_item[counter])
                )
                if result is False:
                    return False
                counter += 1
        else:
            result = value == dict2_item
            if result is False:
                return False
    return True


def load_text(context) -> str:
    return context.text
