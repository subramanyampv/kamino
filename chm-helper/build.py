import os
import sys


def scandir(path):
    '''
    Scans the given directory recursively for HTML articles.
    '''
    result = []
    for dir_entry in os.scandir(path):
        if dir_entry.is_dir():
            result.extend(scandir(os.path.join(path, dir_entry.name)))
        elif dir_entry.name.endswith('.html'):
            result.append(os.path.join(path, dir_entry.name))
    return result


def format_files(files):
    template = '''<LI> <OBJECT type="text/sitemap">
<param name="Name" value="{0}">
<param name="Local" value="{0}">
</OBJECT>
'''
    return [template.format(f) for f in files]


def main():
    path = '.'
    files = scandir(path)
    hhp_template = '''[OPTIONS]
Compatibility=1.1 or later
Compiled file=example.chm
Contents file=toc.hhc
Display compile progress=No
Index file=index.hhk
Language=0x408 Greek (Greece)


[FILES]
%s

[INFOTYPES]
'''

    with open('example.hhp', 'w') as f:
        f.write(hhp_template % os.linesep.join(files))

    toc_template = '''
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
<HTML>
<HEAD>
<meta name="GENERATOR" content="Microsoft&reg; HTML Help Workshop 4.1">
<!-- Sitemap 1.0 -->
</HEAD><BODY>
<OBJECT type="text/site properties">
<param name="ImageType" value="Folder">
</OBJECT>
<UL>
<LI> <OBJECT type="text/sitemap">
<param name="Name" value="Articles">
</OBJECT>
<UL>
%s
</UL>
</UL>
</BODY></HTML>
'''

    with open('toc.hhc', 'w') as f:
        f.write(toc_template % os.linesep.join(format_files(files)))

    hhk_template = '''
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
<HTML>
<HEAD>
<meta name="GENERATOR" content="Microsoft&reg; HTML Help Workshop 4.1">
<!-- Sitemap 1.0 -->
</HEAD><BODY>
<UL>
</UL>
</BODY></HTML>
'''

    with open('index.hhk', 'w') as f:
        f.write(hhk_template)


if __name__ == "__main__":
    main()
