'''Utility module to generate the OAuth token'''
import threading
import re
import webbrowser

from http.server import HTTPServer, BaseHTTPRequestHandler
from requests_oauthlib import OAuth2Session

REDIRECT_URI = 'http://localhost:3000/'


def oauth_token_handler_factory(oauth_token_retriever_instance):
    '''Class factory for OAuthTokenHandler'''
    class OAuthTokenHandler(BaseHTTPRequestHandler):
        '''Intercepts the OAuth Token response'''

        def __init__(self, *args, **kwargs):
            # need to set this before calling parent constructor
            # because the parent constructor calls do_GET
            self.oauth_token_retriever_instance = oauth_token_retriever_instance
            super().__init__(*args, **kwargs)

        def do_GET(self):  # pylint: disable=C0103
            '''Handles the GET method'''
            print('hello world!')
            print(self.requestline)
            match = re.match('^.+code=([^& ]+)', self.requestline)
            code = match[1] if match else None
            if code:
                self._handle_code(code)
            else:
                self._handle_no_code()

        def _handle_code(self, code):
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(
                ('Code: ' + self.oauth_token_retriever_instance.code).encode('utf8'))
            self.oauth_token_retriever_instance.code = code
            self.oauth_token_retriever_instance.kill_server()

        def _handle_no_code(self):
            self.send_response(400)
            self.end_headers()

    return OAuthTokenHandler


class OAuthTokenRetriever:
    '''Retrieves the OAuth token'''

    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.code = ''
        self._httpd = None

    def get_oauth_token(self):
        '''Gets the OAuth token'''
        authorization_url = self._get_authorization_url()
        print(f'Authorization URL: {authorization_url}')
        print('Launching browser...')
        webbrowser.open(authorization_url)
        self._start_server()
        if self.code:
            return self._oauth_gettoken()
        return ''

    def _get_authorization_url(self):
        oauth = OAuth2Session(self.client_id, redirect_uri=REDIRECT_URI)
        authorization_url, state = oauth.authorization_url(  # pylint: disable=unused-variable
            f'https://public-api.wordpress.com/oauth2/authorize?' +
            f'client_id={self.client_id}&redirect_uri={REDIRECT_URI}&response_type=token')
        return authorization_url

    def _start_server(self):
        server_address = ('', 3000)
        print('Starting web server to intercept OAuth code')
        self._httpd = HTTPServer(
            server_address, oauth_token_handler_factory(self))
        with self._httpd:
            self._httpd.serve_forever()
        print('web server stopped')

    def _oauth_gettoken(self):
        '''Get the authentication token'''
        oauth = OAuth2Session(self.client_id, redirect_uri=REDIRECT_URI)
        token = oauth.fetch_token(
            'https://public-api.wordpress.com/oauth2/token',
            client_id=self.client_id,
            client_secret=self.client_secret,
            code=self.code
        )

        print('OAuth token:')
        print(token)
        print(token['access_token'])
        return token['access_token']

    def kill_server(self):
        '''Kills the HTTP server on a separate thread'''
        assassin = threading.Thread(target=self._httpd.shutdown)
        assassin.daemon = True
        assassin.start()


if __name__ == "__main__":
    CLIENT_ID = ''
    CLIENT_SECRET = ''
    RETRIEVER = OAuthTokenRetriever(CLIENT_ID, CLIENT_SECRET)
    print(RETRIEVER.get_oauth_token())
