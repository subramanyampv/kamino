import base64
import json
import urllib.request


class BitbucketCloud:
    '''
    A client for Bitbucket Cloud.
    '''

    def __init__(self):
        self.username = ''
        self.password = ''
        self.owner = ''
        self.slug = ''

    def tag_exists(self, tag):
        '''
        Checks if the given tag already exists.
        '''
        self._ensure_valid_properties()
        if not tag:
            raise ValueError('Tag is not specified')

        url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags?q=name+%3D+%22{tag}%22'
        req = urllib.request.Request(url, headers={
            'Authorization': f'Basic {self._basic_auth()}'
        })
        with urllib.request.urlopen(req) as response:
            self._ensure_successful_status(
                response, f'Could not retrieve tag {tag}: {response.status} - {response.reason}')
            j = json.load(response)
            values = j['values']
            names = [x['name'] for x in values]
            return tag in names

    def get_biggest_tag(self):
        '''
        Gets the biggest tag.
        '''
        self._ensure_valid_properties()
        url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags?sort=-name'
        req = urllib.request.Request(url, headers={
            'Authorization': f'Basic {self._basic_auth()}'
        })
        with urllib.request.urlopen(req) as response:
            self._ensure_successful_status(
                response, f'Could not retrieve tags: {response.status} - {response.reason}')
            j = json.load(response)
            values = j['values']
            names = (x['name'] for x in values)
            return next(names, '')

    def create_tag(self, tag, commit_hash):
        '''
        Creates a git tag.
        '''
        self._ensure_valid_properties()
        if not tag:
            raise ValueError('Tag is not specified')

        if not commit_hash:
            raise ValueError('Commit hash is not specified')

        url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags'
        body = {
            'name': tag,
            'target': {
                'hash': commit_hash
            }
        }

        data = json.dumps(body).encode('ascii')
        req = urllib.request.Request(url, data=data, headers={
            'Authorization': f'Basic {self._basic_auth()}',
            'Content-Type': 'application/json'
        }, method='POST')
        with urllib.request.urlopen(req) as response:
            self._ensure_successful_status(
                response, f'Could not create tag {tag}: {response.status} - {response.reason}')

    def _ensure_valid_properties(self):
        '''
        Ensure the properties of this instance have valid values.
        '''
        if not self.owner:
            raise ValueError('Bitbucket owner is not specified')
        if not self.slug:
            raise ValueError('Repository slug is not specified')
        if not self.username:
            raise ValueError('Bitbucket username is not specified')
        if not self.password:
            raise ValueError('Bitbucket password is not specified')

    def _basic_auth(self):
        '''
        Create the base64 encoded basic authentication string
        '''
        tmp = f'{self.username}:{self.password}'
        tmp = tmp.encode('ascii')
        tmp = base64.b64encode(tmp)
        tmp = tmp.decode('ascii')
        return tmp

    def _ensure_successful_status(self, response, message):
        if response.status < 200 or response.status >= 300:
            raise ValueError(message)
