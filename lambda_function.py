"""
Creates a new Confluence page and links it with a JIRA ticket.
"""

import os
import json
import requests
from requests.auth import HTTPBasicAuth

class Options:
    """
    The options of the function.
    """

    base_url = ""
    username = ""
    password = ""
    spaces = ""

    def __init__(self, environment):
        """
        Initializes based on the given environment.
        You can pass os.environ as the argument.
        """

        self.base_url = environment['ATLASSIAN_CLOUD_NAME']
        if not self.base_url:
            raise ValueError('Missing environment variable ATLASSIAN_CLOUD_NAME')

        self.username = environment['USERNAME']
        if not self.username:
            raise ValueError('Missing environment variable USERNAME')

        self.password = environment['PASSWORD']
        if not self.password:
            raise ValueError('Missing environment variable PASSWORD')

        self.spaces = environment['SPACES']
        if not self.spaces:
            raise ValueError('Missing environment variable SPACES')

    def parent_page_id(self, issue_key):
        """
        Returns the parent page ID that corresponds to the given issue.
        """

        prefix = issue_key.split('-')[0]
        for space_config in self.spaces.split(','):
            kv = space_config.split('=')
            if (kv[0] == prefix):
                return int(kv[1])

        return 0

def view_page_url(base_url, page_id):
    """
    Gets the URL of a Confluence page
    """
    return f"https://{base_url}.atlassian.net/wiki/pages/viewpage.action?pageId={page_id}"

def create_page(options, issue_key, summary):
    """
    Creates a new Confluence page and links it with a JIRA ticket
    """
    parent_page_id = options.parent_page_id(issue_key)
    if parent_page_id <= 0:
        return {
        'result': 'Not a supported space'
    }

    data = {
        'ancestors': [
            {
                'id': parent_page_id
            }
        ],
        'body': {
            'storage':
            {
                "value": """
                <ac:structured-macro ac:name=\"details\" ac:schema-version=\"1\" ac:macro-id=\"6e9b2ec2-f34c-4130-bf49-de9eb13d3225\">
                    <ac:parameter ac:name=\"label\" />
                    <ac:rich-text-body>
                        <table class=\"wrapped\">
                            <tbody>
                                <tr>
                                    <th>Status</th>
                                    <td>
                                        <ac:structured-macro ac:name=\"status\" ac:schema-version=\"1\" ac:macro-id=\"ab9a9bc7-e671-476b-889c-0c553ca825cb\">
                                            <ac:parameter ac:name=\"colour\">Grey</ac:parameter>
                                            <ac:parameter ac:name=\"title\">Not started</ac:parameter>
                                        </ac:structured-macro>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Stakeholders</th>
                                    <td>
                                        <ac:placeholder>(insert stakeholder here)</ac:placeholder>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Outcome</th>
                                    <td>
                                        <ac:placeholder>What did you decide?</ac:placeholder>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Due date</th>
                                    <td>
                                        <ac:placeholder>When is the due date?</ac:placeholder>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Owner</th>
                                    <td>
                                        <ac:placeholder>(insert owner here)</ac:placeholder>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </ac:rich-text-body>
                </ac:structured-macro>

                <h2>Overview</h2>
                <p>Decide on something</p>

                <h2>Decision</h2>
                <ac:structured-macro ac:name=\"tip\" ac:schema-version=\"1\" ac:macro-id=\"01fe8df3-1f03-4706-b117-cdc1b32f8b08\">
                    <ac:rich-text-body>
                        <p>Decision</p>
                    </ac:rich-text-body>
                </ac:structured-macro>

                """,
                "representation": "storage",
            }
        },
        'space': {
            'key': options.space_key
        },
        'status': 'current',
        'title': summary,
        'type': 'page'
    }

    auth = HTTPBasicAuth(options.username, options.password)
    base_url = options.base_url

    # create page
    print('Creating page')
    result = requests.post(
        f'https://{base_url}.atlassian.net/wiki/rest/api/content',
        auth=auth,
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        json=data)
    result.raise_for_status()
    create_page_response = result.json()
    new_page_id = create_page_response['id']
    print(f'Page created {new_page_id}')

    # add label 'decisions'
    print('Marking page with label decision')
    result = requests.post(
        f'https://{base_url}.atlassian.net/wiki/rest/api/content/{new_page_id}/label',
        auth=auth,
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        json=[
            {
                'name': 'decisions'
            }
        ])
    result.raise_for_status()

    # create link from jira to confluence page
    print('Linking from jira to confluence')
    result = requests.post(
        f'https://{base_url}.atlassian.net/rest/api/2/issue/{issue_key}/remotelink',
        auth=auth,
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        json={
            "globalId": f"appId=cf551dd2-cf83-37ca-a19c-62fffd328e08&pageId={new_page_id}",
            "application": {
                "type": "com.atlassian.confluence",
                "name": "System Confluence"
            },
            "relationship": "Wiki Page",
            "object": {
                "url": view_page_url(base_url, new_page_id),
                "title": "Wiki Page"
            }
        }
    )
    result.raise_for_status()
    return create_page_response

def lambda_handler(event, context):
    """
    Gets updates from JIRA when an issue is created.
    """
    print('Received event')
    print(event)
    print('Parsing body')
    body = json.loads(event['body'])
    print('Extracting data')
    issue_key = body['issue']['key']
    summary = body['issue']['fields']['summary']
    print(f'Found key {issue_key} with summary {summary}')
    print('Creating options')
    options = Options(os.environ)

    if 'KDD' in summary:
        return create_page(options, issue_key, summary)

    return {
        'result': 'Not a KDD issue'
    }
