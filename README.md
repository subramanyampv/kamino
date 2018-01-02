# wpbot
WordPress bot. Batch editing of posts on `wordpress.com` blogs.

## Requirements

- Python 3.6.3 and above
- oauthlib 2.0.6
- [requests] 2.18.4
- requests-oauthlib 0.8.0
- register a `wordpress.com` application in order to obtain
  client id and client secret for OAuth2 authentication.
  The app must specify `http://localhost:3000/` as its URL.

## Usage

```
usage: wpbot.py [-h] [--client-id CLIENT_ID] [--client-secret CLIENT_SECRET]
                [-s SITE] [-p POST_ID] [--post-filter {all,fixable,unfixable}]
                {list-tags,list-posts,get-post,fix-post}

WordPress bot

positional arguments:
  {list-tags,list-posts,get-post,fix-post}
                        The command to run

optional arguments:
  -h, --help            show this help message and exit
  --client-id CLIENT_ID
                        Client ID
  --client-secret CLIENT_SECRET
                        Client Secret
  -s SITE, --site SITE  WordPress hostname
  -p POST_ID, --post-id POST_ID
                        Post ID to get/update
  --post-filter {all,fixable,unfixable}
                        Which posts to show
```

## Automatic post corrections

The tool currently supports the following corrections on post content:

- Replaces `<pre class="prettyprint">some code</pre>` with
  [code shortcodes]:

  `[code]some code[/code]`
- Replaces `<span class="code">inline code</span>` with code elements:

  `<code>inline code</code>`

## Examples

### List all tags

```
python wpbot.py \
  --client-id your-client-id --client-secret your-client-secret \
  -s ngeor.wordpess.com \
  list-tags
```

### List all posts

```
python wpbot.py \
  --client-id your-client-id --client-secret your-client-secret \
  -s ngeor.wordpess.com \
  list-posts
```

### List posts that can be automatically corrected

```
python wpbot.py \
  --client-id your-client-id --client-secret your-client-secret \
  -s ngeor.wordpess.com \
  --post-filter fixable \
  list-posts
```

### Get a post

```
python wpbot.py \
  --client-id your-client-id --client-secret your-client-secret \
  -s ngeor.wordpess.com \
  -p 42 \
  get-post
```

### Correct a post

```
python wpbot.py \
  --client-id your-client-id --client-secret your-client-secret \
  -s ngeor.wordpess.com \
  -p 42 \
  fix-post
```

## OAuth2

The OAuth2 token is stored and cached in a file named `oauth.txt` in the current working directory.
The parameters `--client-id` and `--client-secret` are mandatory only when that file is missing.

## Links

- [WordPress.com OAuth2 Authentication](https://developer.wordpress.com/docs/oauth2/)
- [Create new WordPress.com app](https://developer.wordpress.com/apps/new/)

[code shortcodes]: https://en.support.wordpress.com/code/posting-source-code/
[requests]: http://docs.python-requests.org/en/master/
