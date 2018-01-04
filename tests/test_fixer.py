'''Unit tests for fixing content'''
import unittest

import fixer

class EmptyContentTestCase(unittest.TestCase):
    '''Empty Content'''
    def test_is_fixable(self):
        '''Empty content is not fixable'''
        self.assertFalse(fixer.is_fixable(''))

    def test_fix_content(self):
        '''Fixing empty content leaves it empty'''
        self.assertEqual('', fixer.fix_post_content(''))

class PrettyPrintTestCase(unittest.TestCase):
    '''prettyprint pre tag'''
    def test_is_fixable(self):
        '''is fixable'''
        self.assertTrue(fixer.is_fixable('<pre class="prettyprint">some code</pre>'))

    def test_fix_content(self):
        '''is replaced by code shortcode'''
        self.assertEqual(
            '''
[code]
some code
[/code]
''',
            fixer.fix_post_content('<pre class="prettyprint">some code</pre>')
        )

    def test_fix_content_no_trailing_empty_lines(self):
        '''is replaced by code shortcode'''
        self.assertEqual(
            '''
[code]
some code
[/code]
''',
            fixer.fix_post_content('<pre class="prettyprint">some code\n</pre>')
        )

class SpanCodeTestCase(unittest.TestCase):
    '''span code inline tag'''
    def test_fix_content(self):
        '''is replaced by code tag'''
        self.assertEqual(
            '<code>some code</code>',
            fixer.fix_post_content('<span class="code">some code</span>')
        )
