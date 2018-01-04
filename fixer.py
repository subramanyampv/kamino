'''Fixes post content'''

import re

def is_fixable(content):
    '''Checks if the given content can be repaired'''
    return content.find('<pre class="prettyprint">') >= 0

def fix_post_content(content):
    '''Repairs post content by converting pre tags to [code] snippets'''
    fixed_pre_tags = re.sub(
        r'<pre class="prettyprint">(.+?)</pre>',
        r'\n[code]\n\1[/code]\n',
        content,
        flags=re.S)
    fixed_span_tags = re.sub(
        r'<span class="code">(.+?)</span>', r'<code>\1</code>',
        fixed_pre_tags)
    return fixed_span_tags
