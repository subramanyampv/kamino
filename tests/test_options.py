'''
Unit tests for the options class
'''
import unittest

import lambda_function

class OptionsTestCase(unittest.TestCase):
    '''
    Unit tests for the Options class
    '''

    def test_missing_key(self):
        '''
        Tests creating a new page
        '''

        with self.assertRaises(KeyError):
            lambda_function.Options({})

    def test_can_create(self):
        '''
        Tests creating options instance
        '''
        options = lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'hello',
                'USERNAME': 'username',
                'PASSWORD': 'password',
                'SPACES': 'S1=12,XYZ=900'
            }
        )

        self.assertEqual('hello', options.base_url)
        self.assertEqual('username', options.username)
        self.assertEqual('password', options.password)

    def test_empty_url(self):
        '''
        Tests that URL is mandatory
        '''
        with self.assertRaises(ValueError):
            lambda_function.Options(
                {
                    'ATLASSIAN_CLOUD_NAME': '',
                    'USERNAME': 'username',
                    'PASSWORD': 'password',
                    'SPACES': 'S1=12,XYZ=900'
                }
            )

    def test_empty_username(self):
        '''
        Tests that username is mandatory
        '''
        with self.assertRaises(ValueError):
            lambda_function.Options(
                {
                    'ATLASSIAN_CLOUD_NAME': 'url',
                    'USERNAME': '',
                    'PASSWORD': 'password',
                    'SPACES': 'S1=12,XYZ=900'
                }
            )

    def test_empty_password(self):
        '''
        Tests that password is mandatory
        '''
        with self.assertRaises(ValueError):
            lambda_function.Options(
                {
                    'ATLASSIAN_CLOUD_NAME': 'url',
                    'USERNAME': 'username',
                    'PASSWORD': '',
                    'SPACES': 'S1=12,XYZ=900'
                }
            )

    def test_empty_spaces(self):
        '''
        Tests that spaces configuration is mandatory
        '''
        with self.assertRaises(ValueError):
            lambda_function.Options(
                {
                    'ATLASSIAN_CLOUD_NAME': 'url',
                    'USERNAME': 'username',
                    'PASSWORD': 'password',
                    'SPACES': ''
                }
            )

    def test_spaces(self):
        '''
        Tests multiple space configuration
        '''
        options = lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'hello',
                'USERNAME': 'username',
                'PASSWORD': 'password',
                'SPACES': 'IG=42,AB=50'
            }
        )

        parent_page_id = options.parent_page_id('IG-100')

        self.assertEqual(42, parent_page_id)

    def test_spaces_unknown_space(self):
        '''
        Tests unknown space key
        '''
        options = lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'hello',
                'USERNAME': 'username',
                'PASSWORD': 'password',
                'SPACES': 'IG=42,AB=50'
            }
        )

        parent_page_id = options.parent_page_id('XY-100')

        self.assertEqual(0, parent_page_id)

if __name__ == '__main__':
    unittest.main()
