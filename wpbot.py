'''Wordpress bot main module'''
import argparse
import re
import requests

OAUTH_TOKEN = ''
SITE = 'ngeor.wordpress.com'

def parse_args():
    '''Parses command line arguments'''
    parser = argparse.ArgumentParser(description='Wordpress bot')
    parser.add_argument('-t', '--token', required=True, help='OAuth2 Token')
    parser.add_argument('-s', '--site', default='ngeor.wordpress.com', help='Wordpress hostname')
    parser.add_argument('-p', '--post-id', type=int, help='Post ID to get/update')
    parser.add_argument(
        '--post-filter',
        choices=['all', 'fixable', 'unfixable'],
        default='all',
        help='Which posts to show'
    )
    parser.add_argument(
        'command',
        choices=['list-tags', 'list-posts', 'get-post', 'fix-post'],
        help='The command to run')
    return parser.parse_args()

def list_all_tags():
    '''Lists all tags of the blog'''
    page = 1
    success = True
    print("ID\tSlug\tName\tCount")
    while success:
        payload = {'page' : page}
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{SITE}/tags',
            headers={'Authorization': 'Bearer ' + OAUTH_TOKEN},
            params=payload)

        json = response.json()

        for tag in json:
            print(f"{tag['id']}\t{tag['slug']}\t{tag['name']}\t{tag['count']}")

        success = json
        page = page + 1

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

def list_posts(post_filter):
    '''Lists posts'''
    page = 1
    success = True
    total_posts = 0
    total_shown_posts = 0
    while success:
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{SITE}/posts',
            headers={'Authorization': 'Bearer ' + OAUTH_TOKEN},
            params={'context' : 'edit', 'page': page})

        json = response.json()
        total_posts = total_posts + len(json)
        for post in json:
            post_id = post['id']
            title = post['title']['raw']
            content = post['content']['raw']
            is_fixable = content.find('<pre class="prettyprint">') >= 0

            show_post = False
            if post_filter == 'all':
                show_post = True
            elif post_filter == 'fixable' and is_fixable:
                show_post = True
            elif post_filter == 'unfixable' and not is_fixable:
                show_post = True

            if show_post:
                print(f"ID: {post_id}")
                print(f"Title: {title}")
                if is_fixable and post_filter == 'all':
                    print("*** can be fixed!")
                print("")
                total_shown_posts = total_shown_posts + 1
        success = len(json) >= 10
        page = page + 1
    print('Found %d posts (%d total)' % (total_shown_posts, total_posts))

def get_post(post_id):
    '''Gets a single post'''
    response = requests.get(
        f'https://public-api.wordpress.com/wp/v2/sites/{SITE}/posts/{post_id}',
        headers={'Authorization': 'Bearer ' + OAUTH_TOKEN},
        params={'context' : 'edit'})

    json = response.json()
    print(json)

    post = json
    post_id = post['id']
    title = post['title']['raw']
    content = post['content']['raw']
    print(f"ID: {post_id}")
    print(f"Title: {title}")
    if content.find('<pre class="prettyprint">') >= 0:
        print(content)
        print("")
        print("After regex:")
        print(fix_post_content(content))
    print("")

def fix_post(post_id):
    '''Fixes a single post'''
    response = requests.get(
        f'https://public-api.wordpress.com/wp/v2/sites/{SITE}/posts/{post_id}',
        headers={'Authorization': 'Bearer ' + OAUTH_TOKEN},
        params={'context' : 'edit'})

    json = response.json()
    print(json)

    post = json
    post_id = post['id']
    title = post['title']['raw']
    content = post['content']['raw']
    print(f"ID: {post_id}")
    print(f"Title: {title}")
    if content.find('<pre class="prettyprint">') >= 0:
        print(content)
        print("")
        print("After regex:")
        fixed_content = fix_post_content(content)
        print(fixed_content)

        requests.post(
            f'https://public-api.wordpress.com/wp/v2/sites/{SITE}/posts/{post_id}',
            headers={'Authorization': 'Bearer ' + OAUTH_TOKEN},
            params={'content' : fixed_content})

        print("modified post!")
    print("")


if __name__ == "__main__":
    args = parse_args()
    OAUTH_TOKEN = args.token
    SITE = args.site

    if args.command == 'list-tags':
        list_all_tags()
    elif args.command == 'list-posts':
        list_posts(args.post_filter)
    elif args.command == 'get-post':
        get_post(args.post_id)
    elif args.command == 'fix-post':
        fix_post(args.post_id)
