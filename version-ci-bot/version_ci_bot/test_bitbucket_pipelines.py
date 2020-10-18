import unittest
import os
from unittest.mock import patch
from version_ci_bot.bitbucket_pipelines import *


@patch.dict('os.environ', {'BITBUCKET_COMMIT': 'sha1'})
class BitbucketPipelinesTestCase(unittest.TestCase):
    def test_commit(self):
        result = commit()
        self.assertEqual(result, 'sha1')
