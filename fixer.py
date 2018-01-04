'''Fixes post content'''

import re

class RegexFixerBase:
    '''
    Base class for fixers with a regex
    '''

    def __init__(self, search_pattern, replace_pattern):
        self.search_pattern = search_pattern
        self.replace_pattern = replace_pattern

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return re.search(self.search_pattern, content, flags=re.S)

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            self.search_pattern,
            self.replace_pattern,
            content,
            flags=re.S)

class SpanFixer(RegexFixerBase):
    '''
    Fixes span elements with code class.
    '''

    def __init__(self):
        super().__init__(
            r'<span class="code">(.+?)</span>',
            r'<code>\1</code>')

class PreCodeFixer(RegexFixerBase):
    '''
    Fixes pre elements with nested code element
    '''

    def __init__(self):
        super().__init__(
            r'<pre[^>]*><code>[\r\n]*(.+?)[\r\n]*</code></pre>',
            r'\n[code]\n\1\n[/code]\n')

class PrePrettyprintFixer(RegexFixerBase):
    '''
    Fixes pre elements with prettyprint class
    '''

    def __init__(self):
        super().__init__(
            r'<pre class="prettyprint">[\r\n]*(.+?)[\r\n]*</pre>',
            r'\n[code]\n\1\n[/code]\n')

class EmptyParagraphFixer(RegexFixerBase):
    '''Fixes empty paragraphs'''

    def __init__(self):
        super().__init__(
            r'<p>\s*</p>',
            r'\n')

class BlockquotePreFixer(RegexFixerBase):
    '''
    Fixes blockquote pre elements
    '''

    def __init__(self):
        super().__init__(
            r'<blockquote>\s*<pre>\s*(.+?)\s*</pre>\s*</blockquote>',
            r'\n[code]\n\1\n[/code]\n')

class DivPreCodeFixer(RegexFixerBase):
    '''
    Fixes div pre code elements
    '''

    def __init__(self):
        super().__init__(
            r'<div class="highlighter-rouge">\s*<pre class="highlight">\s*<code>\s*(.+?)\s*</code>\s*</pre>\s*</div>',
            r'\n[code]\n\1\n[/code]\n'
        )

class PreFixer:
    '''
    Fixes remaining pre elements
    '''

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return content.find('<pre') >= 0

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            r'<pre[^>]*>\s*(.+?)\s*</pre>',
            r'\n[code]\n\1\n[/code]\n',
            content,
            flags=re.S)

CLASSES = [
    BlockquotePreFixer,
    DivPreCodeFixer,
    SpanFixer,
    PreCodeFixer,
    PrePrettyprintFixer,
    EmptyParagraphFixer,
    #PreFixer
]

def is_fixable(content):
    '''Checks if the given content can be repaired'''
    for klass in CLASSES:
        instance = klass()
        if instance.is_fixable(content):
            return True
    return False


def fix_post_content(content):
    '''Repairs post content by converting pre tags to [code] snippets'''

    result = content
    for klass in CLASSES:
        instance = klass()
        result = instance.fix(result)
    return result
