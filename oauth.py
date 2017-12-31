'''Utility module to generate the OAuth token'''
from requests_oauthlib import OAuth2Session

CLIENT_ID = ''
CLIENT_SECRET = ''
REDIRECT_URI = ''

def oauth_getcode():
    '''Get the code that is necessary to generate the oauth token'''
    oauth = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI)
    authorization_url = oauth.authorization_url(
        f'https://public-api.wordpress.com/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=token')

    print('Please visit this URL to authorize access:')
    print(authorization_url)

def oauth_gettoken(code):
    '''Get the authentication token'''
    oauth = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI)
    token = oauth.fetch_token(
        'https://public-api.wordpress.com/oauth2/token',
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        code=code
    )

    print('OAuth token:')
    print(token)
