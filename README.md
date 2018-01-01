# wpbot
Wordpress bot

```
usage: wpbot.py [-h] [--client-id CLIENT_ID] [--client-secret CLIENT_SECRET]
                [-s SITE] [-p POST_ID] [--post-filter {all,fixable,unfixable}]
                {list-tags,list-posts,get-post,fix-post}

Wordpress bot

positional arguments:
  {list-tags,list-posts,get-post,fix-post}
                        The command to run

optional arguments:
  -h, --help            show this help message and exit
  --client-id CLIENT_ID
                        Client ID
  --client-secret CLIENT_SECRET
                        Client Secret
  -s SITE, --site SITE  Wordpress hostname
  -p POST_ID, --post-id POST_ID
                        Post ID to get/update
  --post-filter {all,fixable,unfixable}
                        Which posts to show
```
