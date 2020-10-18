from version_ci_bot.bitbucket_cloud import BitbucketCloud
import unittest
import urllib.request
from unittest.mock import patch


def mock_successful_request(mock, string_response):
    response = mock.return_value
    response.__enter__.return_value = response
    response.read.return_value = string_response
    response.status = 200
    response.reason = 'OK'


def mock_failed_request(mock, status, reason):
    response = mock.return_value
    response.__enter__.return_value = response
    response.status = status
    response.reason = reason


class TestValidation:
    # pylint: disable=E1101
    def act(self):
        raise NotImplementedError('Please implement me in the subclass')

    def test_missing_username_too(self):
        self.api.username = ''
        with self.assertRaisesRegex(ValueError, 'Bitbucket username is not specified'):
            self.act()

    def test_missing_password(self):
        self.api.password = ''
        with self.assertRaisesRegex(ValueError, 'Bitbucket password is not specified'):
            self.act()

    def test_missing_owner(self):
        self.api.owner = ''
        with self.assertRaisesRegex(ValueError, 'Bitbucket owner is not specified'):
            self.act()

    def test_missing_slug(self):
        self.api.slug = ''
        with self.assertRaisesRegex(ValueError, 'Repository slug is not specified'):
            self.act()


class TagExistsTestCase(unittest.TestCase, TestValidation):

    def setUp(self):
        self.api = BitbucketCloud()
        self.api.username = 'root'
        self.api.password = 'secret'
        self.api.owner = 'acme'
        self.api.slug = 'project'

        self.string_response = '''
    {
      "values": [
        {
          "name": "v1.2.3"
        },
        {
          "name": "v1.2.4"
        }
      ]
    }
    '''

    def act(self):
        self.api.tag_exists('v1.2.3')

    def test_missing_tag(self):
        with self.assertRaisesRegex(ValueError, 'Tag is not specified'):
            self.api.tag_exists('')

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_tag_exists(self, MockRequest, mock_url_open):
        # arrange
        mock_successful_request(mock_url_open, self.string_response)

        # act
        result = self.api.tag_exists('v1.2.3')

        # assert
        self.assertTrue(result)
        MockRequest.assert_called_with(
            'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?q=name+%3D+%22v1.2.3%22',
            headers={
                'Authorization': 'Basic cm9vdDpzZWNyZXQ=',
            }
        )
        mock_url_open.assert_called_with(MockRequest.return_value)

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_tag_does_not_exist(self, MockRequest, mock_url_open):
        # arrange
        mock_successful_request(mock_url_open, self.string_response)

        # act
        result = self.api.tag_exists('v1.2.5')

        # assert
        self.assertFalse(result)

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_failed_response(self, MockRequest, mock_url_open):
        # arrange
        mock_failed_request(mock_url_open, 400, 'Bad Request')

        # act and assert
        with self.assertRaisesRegex(ValueError, 'Could not retrieve tag v1.2.6: 400 - Bad Request'):
            self.api.tag_exists('v1.2.6')


class GetBiggestTagTestCase(unittest.TestCase, TestValidation):

    def setUp(self):
        self.api = BitbucketCloud()
        self.api.username = 'root'
        self.api.password = 'secret'
        self.api.owner = 'acme'
        self.api.slug = 'project'

        self.string_response = '''
    {
      "values": [
        {
          "name": "v1.3.0"
        },
        {
          "name": "v1.2.4"
        }
      ]
    }
    '''

    def act(self):
        self.api.get_biggest_tag()

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_tag_exists(self, MockRequest, mock_url_open):
        # arrange
        mock_successful_request(mock_url_open, self.string_response)

        # act
        result = self.api.get_biggest_tag()

        # assert
        self.assertEqual(result, 'v1.3.0')
        MockRequest.assert_called_with(
            'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?sort=-name',
            headers={
                'Authorization': 'Basic cm9vdDpzZWNyZXQ=',
            }
        )
        mock_url_open.assert_called_with(MockRequest.return_value)

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_tag_does_not_exist(self, MockRequest, mock_url_open):
        # arrange
        mock_successful_request(mock_url_open, '{ "values": [] }')

        # act
        result = self.api.get_biggest_tag()

        # assert
        self.assertEqual(result, '')

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_failed_response(self, MockRequest, mock_url_open):
        # arrange
        mock_failed_request(mock_url_open, 400, 'Bad Request')

        # act and assert
        with self.assertRaisesRegex(ValueError, 'Could not retrieve tags: 400 - Bad Request'):
            self.api.get_biggest_tag()


class CreateTagTestCase(unittest.TestCase, TestValidation):

    def setUp(self):
        self.api = BitbucketCloud()
        self.api.username = 'root'
        self.api.password = 'secret'
        self.api.owner = 'acme'
        self.api.slug = 'project'

    def act(self):
        self.api.create_tag('v1.2.3', 'abcdef')

    def test_missing_tag(self):
        with self.assertRaisesRegex(ValueError, 'Tag is not specified'):
            self.api.create_tag('', 'abcdef')

    def test_missing_commit_hash(self):
        with self.assertRaisesRegex(ValueError, 'Commit hash is not specified'):
            self.api.create_tag('v1.2.3', '')

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_create(self, MockRequest, mock_url_open):
        # arrange
        mock_successful_request(mock_url_open, '')

        # act
        self.api.create_tag('v1.2.3', 'ab-cd-ef')

        # assert
        MockRequest.assert_called_with(
            'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags',
            data=b'{"name": "v1.2.3", "target": {"hash": "ab-cd-ef"}}',
            headers={
                'Authorization': 'Basic cm9vdDpzZWNyZXQ=',
                'Content-Type': 'application/json'
            },
            method='POST')
        mock_url_open.assert_called_with(MockRequest.return_value)

    @patch('urllib.request.urlopen')
    @patch('urllib.request.Request')
    def test_failed_response(self, MockRequest, mock_url_open):
        # arrange
        mock_failed_request(mock_url_open, 400, 'Bad Request')

        # act and assert
        with self.assertRaisesRegex(ValueError, 'Could not create tag v1.2.6: 400 - Bad Request'):
            self.api.create_tag('v1.2.6', 'abc-def')
