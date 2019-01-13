import base64
import json
import urllib.request


class BitbucketCloud:
  def __init__(self):
    self.username = ''
    self.password = ''
    self.owner = ''
    self.slug = ''

  def tag_exists(self, tag):
    self._ensure_valid_properties()
    if not tag:
      raise ValueError('Tag is not specified')

    url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags?q=name+%3D+%22{tag}%22'

    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Basic {self._basic_auth()}')
    with urllib.request.urlopen(req) as f:
      if f.status != 200:
        raise ValueError(
            f'Could not retrieve tag {tag}: {f.status} - {f.reason}')
      j = json.load(f)
      values = j['values']
      names = [x['name'] for x in values]
      return tag in names

  def create_tag(self, tag, commit_hash):
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

    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'Basic {self._basic_auth()}')

    with urllib.request.urlopen(req) as f:
      if f.status < 200 or f.status >= 300:
        raise ValueError(
            f'Could not create tag {tag}: {f.status} - {f.reason}')

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
