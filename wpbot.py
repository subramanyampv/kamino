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

    def _parse_args(self):
        '''Parses command line arguments'''
        return args_parser.parse_args()

    def list_all_tags(self):
        '''Lists all tags of the blog'''
        page = 1
        has_more = True
        print("ID\tSlug\tName\tCount")
        while has_more:
            payload = {'page' : page}
            response = requests.get(
                f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/tags',
                headers={'Authorization': 'Bearer ' + self.oauth_token},
                params=payload)

            json = response.json()

            for tag in json:
                print(f"{tag['id']}\t{tag['slug']}\t{tag['name']}\t{tag['count']}")

            has_more = len(json) >= PAGE_SIZE
            page = page + 1

    def list_posts(self, post_filter):
        '''Lists posts'''
        page = 1
        has_more = True
        total_posts = 0
        total_shown_posts = 0
        while has_more:
            response = requests.get(
                f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts',
                headers={'Authorization': 'Bearer ' + self.oauth_token},
                params={'context' : 'edit', 'page': page})

            json = response.json()
            total_posts = total_posts + len(json)
            for post in json:
                post_id = post['id']
                title = post['title']['raw']
                content = post['content']['raw']
                is_fixable = fixer.is_fixable(content)

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
            has_more = len(json) >= PAGE_SIZE
            page = page + 1
        print('Found %d posts (%d total)' % (total_shown_posts, total_posts))

    def get_post(self, post_id):
        '''Gets a single post'''
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
            headers={'Authorization': 'Bearer ' + self.oauth_token},
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
            print(fixer.fix_post_content(content))
        print("")

    def fix_post(self, post_id):
        '''Fixes a single post'''
        response = requests.get(
            f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
            headers={'Authorization': 'Bearer ' + self.oauth_token},
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
            fixed_content = fixer.fix_post_content(content)
            print(fixed_content)

            requests.post(
                f'https://public-api.wordpress.com/wp/v2/sites/{self.site}/posts/{post_id}',
                headers={'Authorization': 'Bearer ' + self.oauth_token},
                params={'content' : fixed_content})

            print("modified post!")
        print("")

    def _get_cached_oauth_token(self):
        try:
            with open('oauth.txt', 'r') as file:
                return file.readline()
        except OSError:
            print('Cached OAuth token not found')
            return None

    def _cache_oauth_token(self, oauth_token):
        with open('oauth.txt', 'w') as file:
            file.write(oauth_token)

    def _get_oauth_token(self, client_id, client_secret):
        oauth_token = self._get_cached_oauth_token()
        if not oauth_token:
            oauth_retriever = oauth.OAuthTokenRetriever(client_id, client_secret)
            oauth_token = oauth_retriever.get_oauth_token()
            self._cache_oauth_token(oauth_token)
        return oauth_token

    def cli(self):
        '''Runs the CLI interface'''
        args = self._parse_args()
        self.oauth_token = self._get_oauth_token(args.client_id, args.client_secret)
        self.site = args.site

        if args.command == 'list-tags':
            self.list_all_tags()
        elif args.command == 'list-posts':
            self.list_posts(args.post_filter)
        elif args.command == 'get-post':
            self.get_post(args.post_id)
        elif args.command == 'fix-post':
            self.fix_post(args.post_id)

if __name__ == "__main__":
    WPBot().cli()
