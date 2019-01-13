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
    if not self.owner:
      raise ValueError('Bitbucket owner is not specified')
    if not self.slug:
      raise ValueError('Repository slug is not specified')
    if not self.username:
      raise ValueError('Bitbucket username is not specified')
    if not self.password:
      raise ValueError('Bitbucket password is not specified')
    if not tag:
      raise ValueError('Tag is not specified')

    url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags?q=name+%3D+%22{tag}%22'
    opener = urllib.request.build_opener()
    opener.addheaders = [
        ('Authorization', f'Basic {self._basic_auth()}')
    ]
    with opener.open(url) as f:
      j = json.load(f)
      values = j['values']
      names = [x['name'] for x in values]
      return tag in names

  def _basic_auth(self):
    tmp = f'{self.username}:{self.password}'
    tmp = tmp.encode('ascii')
    tmp = base64.b64encode(tmp)
    tmp = tmp.decode('ascii')
    return tmp
