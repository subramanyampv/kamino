import datetime
import unittest
import subprocess
from unittest.mock import MagicMock
from git import Git


class GitTestCase(unittest.TestCase):
    def test_rev_list_normal(self):
        # arrange
        git = Git()
        since = datetime.date(2018, 12, 30)
        until = datetime.date(2019, 1, 1)
        subprocess_result = MagicMock()
        subprocess_result.stdout = 'sha1'
        subprocess.run = MagicMock(
            name='run',
            return_value=subprocess_result
        )

        # act
        result = git.rev_list(since, until)

        # assert
        subprocess.run.assert_called_once_with(
            'git rev-list --since=2018-12-30 --until=2019-01-01 master',
            check=True,
            cwd=None,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )

        self.assertEqual('sha1', result)

    def test_rev_list_reverse(self):
        # arrange
        git = Git()
        since = datetime.date(2018, 12, 30)
        until = datetime.date(2019, 1, 1)
        subprocess_result = MagicMock()
        subprocess_result.stdout = 'sha2'
        subprocess.run = MagicMock(
            name='run',
            return_value=subprocess_result
        )

        # act
        result = git.rev_list(since, until, reverse=True)

        # assert
        subprocess.run.assert_called_once_with(
            'git rev-list --since=2018-12-30 --until=2019-01-01 --reverse master',
            check=True,
            cwd=None,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )

        self.assertEqual('sha2', result)

    def test_commit_date(self):
        # arrange
        git = Git()
        subprocess_result = MagicMock()
        subprocess_result.stdout = '2018-12-30 08:53:21 +0100'
        subprocess.run = MagicMock(
            name='run',
            return_value=subprocess_result
        )

        # act
        result = git.commit_date('sha3')

        # assert
        subprocess.run.assert_called_once_with(
            f'git show -s --format=%ci sha3',
            check=True,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )
        self.assertEqual(result, datetime.date(2018, 12, 30))

    def test_checkout(self):
        # arrange
        git = Git()
        subprocess_result = MagicMock()
        subprocess_result.stdout = ''
        subprocess.run = MagicMock(
            name='run',
            return_value=subprocess_result
        )

        # act
        git.checkout('sha4')

        # assert
        subprocess.run.assert_called_once_with(
            f'git checkout -q sha4',
            check=True,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )
