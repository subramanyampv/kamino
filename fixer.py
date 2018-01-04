'''Fixes post content'''

import re

class SpanFixer:
    '''
    Fixes span elements with code class.
    '''

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return content.find('<span class="code"') >= 0

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            r'<span class="code">(.+?)</span>', r'<code>\1</code>',
            content)

class PreCodeFixer:
    '''
    Fixes pre elements with nested code element
    '''

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return content.find('<pre><code>') >= 0

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            r'<pre[^>]*><code>[\r\n]*(.+?)[\r\n]*</code></pre>',
            r'\n[code]\n\1\n[/code]\n',
            content,
            flags=re.S)

class PrePrettyprintFixer:
    '''
    Fixes pre elements with prettyprint class
    '''

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return content.find('<pre class="prettyprint"') >= 0

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            r'<pre[^>]*>[\r\n]*(.+?)[\r\n]*</pre>',
            r'\n[code]\n\1\n[/code]\n',
            content,
            flags=re.S)

class EmptyParagraphFixer:
    '''Fixes empty paragraphs'''

    def is_fixable(self, content):
        '''Checks if the content can be fixed'''
        return content.find('<p> </p>') >= 0

    def fix(self, content):
        '''Fixes the content'''
        return re.sub(
            r'<p>\s*</p>',
            r'\n',
            content
        )

CLASSES = [SpanFixer, PreCodeFixer, PrePrettyprintFixer, EmptyParagraphFixer]

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
