'''
Unit tests for the lambda function
'''
import unittest
import requests_mock

import lambda_function

@requests_mock.Mocker()
class LambdaTestCase(unittest.TestCase):
    '''
    Unit tests for the lambda function
    '''

    # pylint: disable=unused-argument
    def test_not_kdd_issue(self, mocker):
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
        result = lambda_function.lambda_handler_with_environment(event, environment)

        # assert
        self.assertDictEqual(result, {
            'result': 'Not a KDD issue'
        })
    # pylint: enable=unused-argument

    def test_kdd_issue(self, mocker):
        '''
        Test creating a KDD issue
        '''
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
        result = lambda_function.lambda_handler_with_environment(event, environment)

        # assert
        self.assertDictEqual(result, {
            'id': 42
        })

    def test_unsupported_space(self, mocker):
        '''
        Test creating a KDD issue for an unknown space
        '''
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
        result = lambda_function.lambda_handler_with_environment(event, environment)

        # assert
        self.assertDictEqual(result, {
            'result': 'Not a supported space'
        })

if __name__ == '__main__':
    unittest.main()
