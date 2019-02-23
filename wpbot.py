'''WordPress bot main module'''
import requests

import oauth
import args_parser
import fixer

# page size for paginated REST API requests
PAGE_SIZE = 10


class WPBot:
    '''WordPress Bot'''

    def __init__(self):
        self.oauth_token = ''
        self.site = ''
        self.dry_run = False

    def list_all_tags(self):
        '''Lists all tags of the blog'''
        page = 1
        has_more = True
        print("ID\tSlug\tName\tCount")
        while has_more:
            payload = {'page': page}
            response = requests.get(
                f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/tags',
                headers={'Authorization': 'Bearer ' + self.oauth_token},
                params=payload)

            json = response.json()

            for tag in json:
                print(
                    f"{tag['id']}\t{tag['slug']}\t{tag['name']}\t{tag['count']}")

            has_more = len(json) >= PAGE_SIZE
            page = page + 1

    def list_posts(self, post_filter):
        '''Lists posts'''

        stats = {'total_posts': 0, 'total_shown_posts': 0}

        def callback(post_id, title, content):
            '''Called for every post'''
            is_fixable = fixer.is_fixable(content)
            stats['total_posts'] = stats['total_posts'] + 1

            show_post = False
            if post_filter == 'all':
                show_post = True
            elif post_filter == 'fixable' and is_fixable:
                show_post = True
            elif post_filter == 'unfixable' and not is_fixable:
                show_post = True
            if show_post:
                stats['total_shown_posts'] = stats['total_shown_posts'] + 1
                print(f"ID: {post_id}")
                print(f"Title: {title}")
                if is_fixable and post_filter == 'all':
                    print("*** can be fixed!")
                print("")

        self._post_loop(callback)
        print('Showed %d posts (%d total)' %
              (stats['total_shown_posts'], stats['total_posts']))

    def fix_posts(self):
        '''Batch fixing of posts'''

        def callback(post_id, title, content):
            '''Called for every post, fixes content'''
            is_fixable = fixer.is_fixable(content)
            if not is_fixable:
                return

            fixed_content = fixer.fix_post_content(content)
            if content == fixed_content:
                return

            print('ID: %d' % post_id)
            print('Title: %s' % title)
            print('\nOriginal content:\n%s' % content)
            print('\n\nModified content:\n%s' % fixed_content)

            if not self.dry_run:
                print('Modifying content...')
                result = requests.post(
                    f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
                    headers={'Authorization': 'Bearer ' + self.oauth_token},
                    data={'content': fixed_content})
                result.raise_for_status()

        if self.dry_run:
            print('Running in dry run mode')
        self._post_loop(callback)

    def get_post(self, post_id):
        '''Gets a single post'''
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
            headers={'Authorization': 'Bearer ' + self.oauth_token},
            params={'context': 'edit'})

        json = response.json()
        post = json
        post_id = post['id']
        title = post['title']['raw']
        content = post['content']['raw']
        print(f"ID: {post_id}")
        print(f"Title: {title}")
        print(content)
        if fixer.is_fixable(content):
            print("")
            print("After regex:")
            print(fixer.fix_post_content(content))
        else:
            print("Post is not fixable")
        print("")

    def fix_post(self, post_id):
        '''Fixes a single post'''
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
            headers={'Authorization': 'Bearer ' + self.oauth_token},
            params={'context': 'edit'})

        json = response.json()
        post = json
        post_id = post['id']
        title = post['title']['raw']
        content = post['content']['raw']
        print(f"ID: {post_id}")
        print(f"Title: {title}")
        if fixer.is_fixable(content):
            print(content)
            print("")
            print("After regex:")
            fixed_content = fixer.fix_post_content(content)
            print(fixed_content)

            if self.dry_run:
                print('in dry run mode')
            else:
                result = requests.post(
                    f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
                    headers={'Authorization': 'Bearer ' + self.oauth_token},
                    data={'content': fixed_content})
                result.raise_for_status()
                print("modified post!")
        print("")

    def _post_loop(self, callback):
        '''
        Loops over all posts of the blog.
        '''
        page = 1
        has_more = True
        while has_more:
            response = requests.get(
                f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts',
                headers={'Authorization': 'Bearer ' + self.oauth_token},
                params={'context': 'edit', 'page': page})

            json = response.json()
            for post in json:
                post_id = post['id']
                title = post['title']['raw']
                content = post['content']['raw']
                callback(post_id, title, content)
            has_more = len(json) >= PAGE_SIZE
            page = page + 1

    def cli(self):
        '''Runs the CLI interface'''
        args = args_parser.parse_args()
        self.oauth_token = _get_oauth_token(args.client_id, args.client_secret)
        self.site = args.site
        self.dry_run = args.dry_run

        if args.command == 'list-tags':
            self.list_all_tags()
        elif args.command == 'list-posts':
            self.list_posts(args.post_filter)
        elif args.command == 'fix-posts':
            self.fix_posts()
        elif args.command == 'get-post':
            self.get_post(args.post_id)
        elif args.command == 'fix-post':
            self.fix_post(args.post_id)
        else:
            print(f'Unsupported command: {args.command}')


def _get_oauth_token(client_id, client_secret):
    oauth_token = _get_cached_oauth_token()
    if not oauth_token:
        oauth_retriever = oauth.OAuthTokenRetriever(client_id, client_secret)
        oauth_token = oauth_retriever.get_oauth_token()
        _cache_oauth_token(oauth_token)
    return oauth_token


def _get_cached_oauth_token():
    try:
        with open('oauth.txt', 'r') as file:
            return file.readline()
    except OSError:
        print('Cached OAuth token not found')
        return None


def _cache_oauth_token(oauth_token):
    with open('oauth.txt', 'w') as file:
        file.write(oauth_token)


if __name__ == "__main__":
    WPBot().cli()
