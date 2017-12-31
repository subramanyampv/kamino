# wpbot
Wordpress bot

```
usage: wpbot.py [-h] -t TOKEN [-s SITE] [-p POST_ID]
                [--post-filter {all,fixable,unfixable}]
                {list-tags,list-posts,get-post,fix-post}

Wordpress bot

positional arguments:
  {list-tags,list-posts,get-post,fix-post}
                        The command to run

optional arguments:
  -h, --help            show this help message and exit
  -t TOKEN, --token TOKEN
                        OAuth2 Token
  -s SITE, --site SITE  Wordpress hostname
  -p POST_ID, --post-id POST_ID
                        Post ID to get/update
  --post-filter {all,fixable,unfixable}
                        Which posts to show
```
