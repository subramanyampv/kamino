import os
import unittest
from version_ci_bot.main import ensure_tag_does_not_exist, create_tag
from unittest.mock import patch


class EnsureTagDoesNotExistTestCase(unittest.TestCase):
    all_variables = {
        'CI': '1',
        'BITBUCKET_REPO_OWNER': 'acme',
        'BITBUCKET_REPO_SLUG': 'project',
        'BITBUCKET_USERNAME': 'root',
        'BITBUCKET_PASSWORD': 'secret'
    }

    @patch.dict(os.environ, {'CI': ''})
    def test_not_ci(self):
        '''
        Should only run in CI environments
        '''
        with self.assertRaisesRegex(ValueError, 'Should only run in CI environments'):
            ensure_tag_does_not_exist()

    @patch.dict(os.environ, {'CI': '1'})
    def test_no_pom(self):
        '''
        Needs a pom.xml file
        '''
        with self.assertRaisesRegex(ValueError, 'pom.xml not found in directory test'):
            ensure_tag_does_not_exist(cwd='test')

    @patch.dict(os.environ, all_variables)
    @patch('version_ci_bot.bitbucket_cloud.BitbucketCloud')
    def test_pom_tag_exists(self, MockApi):
        '''
        The version defined in pom.xml already exists as a tag
        '''
        MockApi.return_value.tag_exists.return_value = True
        with self.assertRaisesRegex(ValueError, 'Version 1.2.3 is already tagged. Please bump the version in pom.xml'):
            ensure_tag_does_not_exist(cwd='test/pom')
        MockApi.return_value.tag_exists.assert_called_with('v1.2.3')
        self.assertEqual(MockApi.return_value.owner, 'acme')
        self.assertEqual(MockApi.return_value.slug, 'project')
        self.assertEqual(MockApi.return_value.username, 'root')
        self.assertEqual(MockApi.return_value.password, 'secret')

    @patch.dict(os.environ, all_variables)
    @patch('version_ci_bot.bitbucket_cloud.BitbucketCloud')
    def test_pom_tag_does_not_exist(self, MockApi):
        '''
        Happy flow: the version defined in pom.xml does not exist
        '''
        MockApi.return_value.tag_exists.return_value = False
        MockApi.return_value.get_biggest_tag.return_value = 'v1.2.2'
        ensure_tag_does_not_exist(cwd='test/pom')
        MockApi.return_value.tag_exists.assert_called_with('v1.2.3')
        self.assertEqual(MockApi.return_value.owner, 'acme')
        self.assertEqual(MockApi.return_value.slug, 'project')
        self.assertEqual(MockApi.return_value.username, 'root')
        self.assertEqual(MockApi.return_value.password, 'secret')


class CreateTagTestCase(unittest.TestCase):
    all_variables = {
        'CI': '1',
        'BITBUCKET_REPO_OWNER': 'acme',
        'BITBUCKET_REPO_SLUG': 'project',
        'BITBUCKET_USERNAME': 'root',
        'BITBUCKET_PASSWORD': 'secret',
        'BITBUCKET_COMMIT': 'abc-def-g'
    }

    @patch.dict(os.environ, {'CI': ''})
    def test_not_ci(self):
        with self.assertRaisesRegex(ValueError, 'Should only run in CI environments'):
            create_tag()

    @patch.dict(os.environ, {'CI': '1'})
    def test_no_pom(self):
        with self.assertRaisesRegex(ValueError, 'pom.xml not found in directory test'):
            create_tag(cwd='test')

    @patch.dict(os.environ, all_variables)
    @patch('version_ci_bot.bitbucket_cloud.BitbucketCloud')
    def test_pom_create_tag(self, MockApi):
        # arrange
        MockApi.return_value.tag_exists.return_value = False
        MockApi.return_value.get_biggest_tag.return_value = 'v1.2.2'

        # act
        create_tag(cwd='test/pom')

        # assert
        MockApi.return_value.create_tag.assert_called_with(
            'v1.2.3', 'abc-def-g')
        self.assertEqual(MockApi.return_value.owner, 'acme')
        self.assertEqual(MockApi.return_value.slug, 'project')
        self.assertEqual(MockApi.return_value.username, 'root')
        self.assertEqual(MockApi.return_value.password, 'secret')
