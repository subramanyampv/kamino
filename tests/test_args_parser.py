'''Unit tests for argument parsing'''
import unittest

import args_parser

class BasicTestCase(unittest.TestCase):
    '''Basic unit tests for argument parsing'''
    @unittest.expectedFailure
    def test_no_args_should_fail(self):
        '''Parser should fail when no arguments are given'''
        args_parser.parse_args([])

class DryRunTestCase(unittest.TestCase):
    '''Unit tests for dry run feature'''
    def test_dry_run_on(self):
        '''With --dry-run'''
        args = args_parser.parse_args(['--dry-run', 'list-tags'])
        self.assertTrue(args.dry_run)

    def test_dry_run_off(self):
        '''Without --dry-run'''
        args = args_parser.parse_args(['list-tags'])
        self.assertFalse(args.dry_run)

if __name__ == '__main__':
    unittest.main()
