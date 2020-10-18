'''Unit tests for argument parsing'''
import unittest

import args_parser


class BasicTestCase(unittest.TestCase):
    '''Basic unit tests for argument parsing'''

    def test_no_args_should_fail(self):
        '''Parser should fail when no arguments are given'''
        exception = False
        try:
            args_parser.parse_args([])
        except SystemExit:
            exception = True
        self.assertTrue(exception)


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


class CommandsTestCase(unittest.TestCase):
    '''Supported commands'''

    def test_list_tags(self):
        '''list-tags command'''
        args = args_parser.parse_args(['list-tags'])
        self.assertEqual('list-tags', args.command)

    def test_list_posts(self):
        '''list-posts command'''
        args = args_parser.parse_args(['list-posts'])
        self.assertEqual('list-posts', args.command)

    def test_fix_posts(self):
        '''fix-posts command'''
        args = args_parser.parse_args(['fix-posts'])
        self.assertEqual('fix-posts', args.command)


if __name__ == '__main__':
    unittest.main()
