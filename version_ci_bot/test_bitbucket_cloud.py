from version_ci_bot.bitbucket_cloud import BitbucketCloud
import unittest
import urllib.request
from unittest.mock import patch


def mock_successful_request(mock, string_response):
  mock_opener = mock.return_value
  response = mock_opener.open.return_value
  response.__enter__.return_value = response
  response.read.return_value = string_response
  response.status = 200
  response.reason = 'OK'


def mock_failed_request(mock, status, reason):
  mock_opener = mock.return_value
  response = mock_opener.open.return_value
  response.__enter__.return_value = response
  response.status = status
  response.reason = reason


@patch('urllib.request.build_opener')
class BitbucketCloudTestCase(unittest.TestCase):
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

  def test_missing_username(self, mock):
    self.api.username = ''
    with self.assertRaisesRegex(ValueError, 'Bitbucket username is not specified'):
      self.api.tag_exists('v1.2.3')

  def test_missing_password(self, mock):
    self.api.password = ''
    with self.assertRaisesRegex(ValueError, 'Bitbucket password is not specified'):
      self.api.tag_exists('v1.2.3')

  def test_missing_owner(self, mock):
    self.api.owner = ''
    with self.assertRaisesRegex(ValueError, 'Bitbucket owner is not specified'):
      self.api.tag_exists('v1.2.3')

  def test_missing_slug(self, mock):
    self.api.slug = ''
    with self.assertRaisesRegex(ValueError, 'Repository slug is not specified'):
      self.api.tag_exists('v1.2.3')

  def test_missing_tag(self, mock):
    with self.assertRaisesRegex(ValueError, 'Tag is not specified'):
      self.api.tag_exists('')

  def test_tag_exists(self, mock):
    # arrange
    mock_successful_request(mock, self.string_response)

    # act
    result = self.api.tag_exists('v1.2.3')

    # assert
    self.assertTrue(result)
    self.assertEqual(mock.return_value.addheaders, [
                     ('Authorization', 'Basic cm9vdDpzZWNyZXQ=')])
    mock.return_value.open.assert_called_with(
        'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?q=name+%3D+%22v1.2.3%22')

  def test_tag_does_not_exist(self, mock):
    # arrange
    mock_successful_request(mock, self.string_response)

    # act
    result = self.api.tag_exists('v1.2.5')

    # assert
    self.assertFalse(result)
    self.assertEqual(mock.return_value.addheaders, [
                     ('Authorization', 'Basic cm9vdDpzZWNyZXQ=')])
    mock.return_value.open.assert_called_with(
        'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?q=name+%3D+%22v1.2.5%22')

  def test_failed_response(self, mock):
    # arrange
    mock_failed_request(mock, 400, 'Bad Request')

    # act and assert
    with self.assertRaisesRegex(ValueError, 'Could not retrieve tag v1.2.6: 400 - Bad Request'):
      self.api.tag_exists('v1.2.6')
