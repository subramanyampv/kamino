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

class BlockquotePreTestCase(unittest.TestCase):
    '''blockquote pre tag'''
    def test_is_fixable(self):
        '''is fixable'''
        self.assertTrue(fixer.is_fixable('<blockquote>\n<pre>\nsome code\n</pre>\n</blockquote>'))

    def test_is_fixable_2(self):
        '''is fixable 2'''
        self.assertTrue(fixer.is_fixable('''something
<blockquote>
<pre>rails new MyApp --database=mysql</pre>
</blockquote>'''))

    def test_fix_content(self):
        '''is replaced by code shortcode'''
        self.assertEqual(
            '''something
[code]
some code
[/code]
''',
            fixer.fix_post_content('something<blockquote>\n<pre>\nsome code\n</pre>\n</blockquote>')
        )

    def test_fix_content_2(self):
        '''fix content 2'''
        self.assertEqual(
            '''
[code]
rails new MyApp --database=mysql
[/code]
''',
            fixer.fix_post_content('''<blockquote>
<pre>rails new MyApp --database=mysql</pre>
</blockquote>'''))

class SpanCodeTestCase(unittest.TestCase):
    '''span code inline tag'''
    def test_fix_content(self):
        '''is replaced by code tag'''
        self.assertEqual(
            '<code>some code</code>',
            fixer.fix_post_content('<span class="code">some code</span>')
        )

class DivPreCodeTestCase(unittest.TestCase):
    '''div pre code'''
    def test_fix_content(self):
        '''is replaced by code tag'''
        self.assertEqual(
            '''
[code]
cd /usr/local/src
git clone git://github.com/mono/xsp.git
cd xsp
./autogen.sh --prefix=/usr/local
make
make install
[/code]
''',
            fixer.fix_post_content('''<div class="highlighter-rouge">
<pre class="highlight"><code>cd /usr/local/src
git clone git://github.com/mono/xsp.git
cd xsp
./autogen.sh --prefix=/usr/local
make
make install
</code></pre>
</div>''')
        )
