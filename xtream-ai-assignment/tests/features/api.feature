Feature: Testing API

  Scenario: Handle exception when sending a malformed request (missing city_development_index)
    When I send a POST request to "/api/v1/candidate:churn" with body:
    """
    [{
      "enrollee_id": 1,
      "city": "city_75",
      "gender": "Male",
      "relevent_experience": null,
      "enrolled_university": "no_enrollment",
      "education_level": "Graduate",
      "major_discipline": "STEM",
      "experience": ">20",
      "company_size": null,
      "company_type": null,
      "last_new_job": "1",
      "training_hours": 36
    }]
    """
    Then I expect the last response status to be "422"

  Scenario: Retrieve the information
    When I send a POST request to "/api/v1/candidate:churn" with body:
    """
    [{
      "enrollee_id": 1,
      "city": "city_75",
      "city_development_index": "0.767",
      "gender": "Male",
      "relevent_experience": null,
      "enrolled_university": "no_enrollment",
      "education_level": "Graduate",
      "major_discipline": "STEM",
      "experience": ">20",
      "company_size": null,
      "company_type": null,
      "last_new_job": "1",
      "training_hours": 36
    }]
    """
    Then I expect the last response status to be "200"
    And I expect the last response to be a JSON containing the following elements:
    """
    [{
      "enrollee_id": 1,
      "churn": 0
    }]
    """