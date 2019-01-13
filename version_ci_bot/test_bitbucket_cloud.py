from version_ci_bot.bitbucket_cloud import BitbucketCloud
import unittest
import urllib.request
from unittest.mock import patch


class StubResponse:
  def __init__(self, response):
    self.response = response

  def __enter__(self):
    return self

  def __exit__(self, *args):
    pass

  def read(self):
    return self.response


@patch('urllib.request.build_opener')
class BitbucketCloudTestCase(unittest.TestCase):
  def setUp(self):
    self.api = BitbucketCloud()
    self.api.username = 'root'
    self.api.password = 'secret'
    self.api.owner = 'acme'
    self.api.slug = 'project'

    self.response = StubResponse('''
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
    ''')

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
    mock_opener = mock.return_value
    mock_opener.open.return_value = self.response

    # act
    result = self.api.tag_exists('v1.2.3')

    # assert
    self.assertTrue(result)
    self.assertEqual(mock_opener.addheaders, [
                     ('Authorization', 'Basic cm9vdDpzZWNyZXQ=')])
    mock_opener.open.assert_called_with(
        'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?q=name+%3D+%22v1.2.3%22')

  def test_tag_does_not_exist(self, mock):
    # arrange
    mock_opener = mock.return_value
    mock_opener.open.return_value = self.response

    # act
    result = self.api.tag_exists('v1.2.5')

    # assert
    self.assertFalse(result)
    self.assertEqual(mock_opener.addheaders, [
                     ('Authorization', 'Basic cm9vdDpzZWNyZXQ=')])
    mock_opener.open.assert_called_with(
        'https://api.bitbucket.org/2.0/repositories/acme/project/refs/tags?q=name+%3D+%22v1.2.5%22')
