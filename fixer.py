'''Fixes post content'''

import re
import html
# pylint: disable=too-few-public-methods


class RegexFixerBase:
    '''
    Base class for fixers with a regex
    '''

    def __init__(self, search_pattern, replace_pattern):
        self.search_pattern = search_pattern
        self.replace_pattern = replace_pattern

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
            r'<div class="highlighter-rouge">\s*' +
            r'<pre class="highlight">\s*<code>\s*(.+?)\s*' +
            r'</code>\s*</pre>\s*</div>',
            r'\n[code]\n\1\n[/code]\n'
        )


class PreFixer(RegexFixerBase):
    '''
    Fixes remaining pre elements
    '''

    def __init__(self):
        super().__init__(
            r'<pre[^>]*>\s*(.+?)\s*</pre>',
            r'\n[code]\n\1\n[/code]\n'
        )


class StripCodeHighlighterFixer(RegexFixerBase):
    '''
    Convert <code class="highlighter-rouge"></code> to <code>
    '''

    def __init__(self):
        super().__init__(
            r'<code class="[^"]+">(.+?)</code>',
            r'<code>\1</code>')


class HtmlEncodeFixer(RegexFixerBase):
    '''
    Removes encoded HTML entities from within code snippets
    '''

    def __init__(self):
        super().__init__(
            r'\[code[^\]]*\](.+?)\[/code\]',
            lambda match: _unescape_html(match[0])
        )


def _unescape_html(content):
    '''Unescapes HTML fully'''
    has_changes = True
    current = content

    while has_changes:
        unescaped = html.unescape(current)
        has_changes = unescaped != current
        if has_changes:
            current = unescaped

    return current


def _unescape_double_html(content):
    '''Unescapes double encoded HTML'''
    has_changes = True

    # current iteration
    current = content

    # previous iteration
    previous = content
    while has_changes:
        unescaped = html.unescape(current)
        has_changes = unescaped != current
        if has_changes:
            # we still observe changes, shift values
            previous = current
            current = unescaped

    # return the one before it got stable
    return previous


CLASSES = [
    BlockquotePreFixer,
    DivPreCodeFixer,
    SpanFixer,
    PreCodeFixer,
    PrePrettyprintFixer,
    EmptyParagraphFixer,
    StripCodeHighlighterFixer,
    PreFixer,
    # HtmlEncodeFixer
]


def is_fixable(content):
    '''Checks if the given content can be repaired'''
    return content != fix_post_content(content)


def fix_post_content(content):
    '''Repairs post content by converting pre tags to [code] snippets'''

    result = content
    for klass in CLASSES:
        instance = klass()
        result = instance.fix(result)
    return result
