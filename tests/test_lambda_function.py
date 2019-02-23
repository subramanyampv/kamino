'''
Unit tests for the lambda function
'''
import requests_mock

import lambda_function


def test_not_kdd_issue():
    '''
    Tests receiving notification for a non KDD issue
    '''

    event = {
        'body': '''{
            "issue": {
                "key": "IG-100",
                "fields": {
                    "summary": "A normal ticket"
                }
            }
        }
        '''
    }

    environment = {
        'ATLASSIAN_CLOUD_NAME': 'hello',
        'USERNAME': 'username',
        'PASSWORD': 'password',
        'SPACES': 'S1=12,XYZ=900'
    }

    # act
    result = lambda_function.lambda_handler_with_environment(
        event, environment)

    # assert
    assert result == {
        'result': 'Not a KDD issue'
    }


def test_kdd_issue():
    '''
    Test creating a KDD issue
    '''
    with requests_mock.Mocker() as mocker:
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/wiki/rest/api/content',
            text='{"id": 42}')
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/wiki/rest/api/content/42/label',
            text='whatever')
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/rest/api/2/issue/ABC-100/remotelink',
            text='whatever')
        event = {
            'body': '''{
                "issue": {
                    "key": "ABC-100",
                    "fields": {
                        "summary": "KDD for ci server"
                    }
                }
            }
            '''
        }

        environment = {
            'ATLASSIAN_CLOUD_NAME': 'hello',
            'USERNAME': 'username',
            'PASSWORD': 'password',
            'SPACES': 'ABC=123'
        }

        # act
        result = lambda_function.lambda_handler_with_environment(
            event, environment)

        # assert
        assert result == {
            'id': 42
        }


def test_unsupported_space():
    '''
    Test creating a KDD issue for an unknown space
    '''
    with requests_mock.Mocker() as mocker:
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/wiki/rest/api/content',
            text='{"id": 42}')
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/wiki/rest/api/content/42/label',
            text='whatever')
        mocker.register_uri(
            'POST',
            'https://hello.atlassian.net/rest/api/2/issue/ABC-100/remotelink',
            text='whatever')
        event = {
            'body': '''{
                "issue": {
                    "key": "ABC-100",
                    "fields": {
                        "summary": "KDD for ci server"
                    }
                }
            }
            '''
        }

        environment = {
            'ATLASSIAN_CLOUD_NAME': 'hello',
            'USERNAME': 'username',
            'PASSWORD': 'password',
            'SPACES': 'DEF=123'
        }

        # act
        result = lambda_function.lambda_handler_with_environment(
            event, environment)

        # assert
        assert result == {
            'result': 'Not a supported space'
        }
