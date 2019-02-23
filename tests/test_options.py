'''
Unit tests for the options class
'''
import pytest

import lambda_function


def test_missing_key():
    '''
    Missing key should raise an error.
    '''
    with pytest.raises(KeyError):
        lambda_function.Options({})


def test_can_create():
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

    assert options.base_url == 'hello'
    assert options.username == 'username'
    assert options.password == 'password'


def test_empty_url():
    '''
    Tests that URL is mandatory
    '''
    with pytest.raises(ValueError):
        lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': '',
                'USERNAME': 'username',
                'PASSWORD': 'password',
                'SPACES': 'S1=12,XYZ=900'
            }
        )


def test_empty_username():
    '''
    Tests that username is mandatory
    '''
    with pytest.raises(ValueError):
        lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'url',
                'USERNAME': '',
                'PASSWORD': 'password',
                'SPACES': 'S1=12,XYZ=900'
            }
        )


def test_empty_password():
    '''
    Tests that password is mandatory
    '''
    with pytest.raises(ValueError):
        lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'url',
                'USERNAME': 'username',
                'PASSWORD': '',
                'SPACES': 'S1=12,XYZ=900'
            }
        )


def test_empty_spaces():
    '''
    Tests that spaces configuration is mandatory
    '''
    with pytest.raises(ValueError):
        lambda_function.Options(
            {
                'ATLASSIAN_CLOUD_NAME': 'url',
                'USERNAME': 'username',
                'PASSWORD': 'password',
                'SPACES': ''
            }
        )


def test_spaces():
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

    assert options.parent_page_id('IG-100') == 42


def test_spaces_unknown_space():
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

    assert options.parent_page_id('XY-100') == 0
