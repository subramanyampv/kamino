import os
import unittest
from version_ci_bot.main import ensure_tag_does_not_exist, create_tag
from unittest.mock import patch


class CITestCase(unittest.TestCase):
  @patch.dict(os.environ, {'CI': ''})
  def test_not_ci(self):
    with self.assertRaisesRegex(ValueError, 'Should only run in CI environments'):
      ensure_tag_does_not_exist()

  @patch.dict(os.environ, {'CI': '1'})
  def test_no_pom(self):
    with self.assertRaisesRegex(ValueError, 'pom.xml not found in directory test'):
      ensure_tag_does_not_exist(cwd='test')


class CreateCITestCase(unittest.TestCase):
  @patch.dict(os.environ, {'CI': ''})
  def test_not_ci(self):
    with self.assertRaisesRegex(ValueError, 'Should only run in CI environments'):
      create_tag()

  @patch.dict(os.environ, {'CI': '1'})
  def test_no_pom(self):
    with self.assertRaisesRegex(ValueError, 'pom.xml not found in directory test'):
      create_tag(cwd='test')


@patch.dict(os.environ, {
    'CI': '1',
    'BITBUCKET_REPO_OWNER': 'acme',
    'BITBUCKET_REPO_SLUG': 'project',
    'BITBUCKET_USERNAME': 'root',
    'BITBUCKET_PASSWORD': 'secret'
})
@patch('version_ci_bot.bitbucket_cloud.BitbucketCloud')
class AllEnvVariablesPresentTestCase(unittest.TestCase):
  def test_pom_tag_exists(self, MockApi):
    MockApi.return_value.tag_exists.return_value = True
    with self.assertRaisesRegex(ValueError, 'Version 1.2.3 is already tagged. Please bump the version in pom.xml'):
      ensure_tag_does_not_exist(cwd='test/pom')
    MockApi.return_value.tag_exists.assert_called_with('v1.2.3')
    self.assertEqual(MockApi.return_value.owner, 'acme')
    self.assertEqual(MockApi.return_value.slug, 'project')
    self.assertEqual(MockApi.return_value.username, 'root')
    self.assertEqual(MockApi.return_value.password, 'secret')

  def test_pom_tag_does_not_exist(self, MockApi):
    MockApi.return_value.tag_exists.return_value = False
    ensure_tag_does_not_exist(cwd='test/pom')
    MockApi.return_value.tag_exists.assert_called_with('v1.2.3')
    self.assertEqual(MockApi.return_value.owner, 'acme')
    self.assertEqual(MockApi.return_value.slug, 'project')
    self.assertEqual(MockApi.return_value.username, 'root')
    self.assertEqual(MockApi.return_value.password, 'secret')


@patch.dict(os.environ, {
    'CI': '1',
    'BITBUCKET_REPO_OWNER': 'acme',
    'BITBUCKET_REPO_SLUG': 'project',
    'BITBUCKET_USERNAME': 'root',
    'BITBUCKET_PASSWORD': 'secret',
    'BITBUCKET_COMMIT': 'abc-def-g'
})
@patch('version_ci_bot.bitbucket_cloud.BitbucketCloud')
class CreateTagAllEnvVariablesPresentTestCase(unittest.TestCase):
  def test_pom_tag_exists(self, MockApi):
    create_tag(cwd='test/pom')
    MockApi.return_value.create_tag.assert_called_with('v1.2.3', 'abc-def-g')
    self.assertEqual(MockApi.return_value.owner, 'acme')
    self.assertEqual(MockApi.return_value.slug, 'project')
    self.assertEqual(MockApi.return_value.username, 'root')
    self.assertEqual(MockApi.return_value.password, 'secret')
