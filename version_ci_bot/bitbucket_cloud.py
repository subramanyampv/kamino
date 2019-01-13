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
    url = f'https://api.bitbucket.org/2.0/repositories/{self.owner}/{self.slug}/refs/tags?q=name+%3D+%22{tag}%22'
    opener = urllib.request.build_opener()
    opener.addheaders = [
        ('Authorization', f'Basic {self.basic_auth()}')
    ]
    with opener.open(url) as f:
      j = json.load(f)
      values = j['values']
      names = [x['name'] for x in values]
      return tag in names

  def basic_auth(self):
    tmp = f'{self.username}:{self.password}'
    tmp = tmp.encode('ascii')
    tmp = base64.b64encode(tmp)
    tmp = tmp.decode('ascii')
    return tmp
