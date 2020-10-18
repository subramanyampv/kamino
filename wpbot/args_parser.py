'''Command line arguments parser'''
import argparse
DEFAULT_SITE = 'ngeor.wordpress.com'


def parse_args(args=None):
    '''Parses command line arguments'''
    parser = argparse.ArgumentParser(description='WordPress bot')
    parser.add_argument('--client-id', help='Client ID')
    parser.add_argument('--client-secret', help='Client Secret')
    parser.add_argument('-s', '--site', default=DEFAULT_SITE,
                        help='WordPress hostname')
    parser.add_argument('-p', '--post-id', type=int,
                        help='Post ID to get/update')
    parser.add_argument(
        '--dry-run',
        dest='dry_run',
        action='store_const',
        const=True,
        default=False,
        help='Do not actually perform any changes')
    parser.add_argument(
        '--post-filter',
        choices=['all', 'fixable', 'unfixable'],
        default='all',
        help='Which posts to show'
    )
    parser.add_argument(
        'command',
        choices=['list-tags', 'list-posts',
                 'fix-posts', 'get-post', 'fix-post'],
        help='The command to run')
    return parser.parse_args(args)
