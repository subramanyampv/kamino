"""
Creates a new Confluence page and links it with a JIRA ticket.
"""

import os
import json
import requests
from requests.auth import HTTPBasicAuth


def extract_space_key(issue_key):
    """
    Extracts the space key out of an issue key.
    For example, if the issue key is DEV-100, it returns DEV.
    """

    return issue_key.split('-')[0]


def require_env(environment, key):
    """
    Returns the environment value identified by the given key.
    If not found or if empty, an error will be thrown.
    """

    result = environment[key]
    if not result:
        raise ValueError(f'Missing environment variable {key}')
    return result

# pylint: disable=too-few-public-methods


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

        self.base_url = require_env(environment, 'ATLASSIAN_CLOUD_NAME')
        self.username = require_env(environment, 'USERNAME')
        self.password = require_env(environment, 'PASSWORD')
        self.spaces = require_env(environment, 'SPACES')

    def parent_page_id(self, issue_key):
        """
        Returns the parent page ID that corresponds to the given issue.
        """

        space_key = extract_space_key(issue_key)
        for space_config in self.spaces.split(','):
            [
                configured_space_key,
                configured_page_id
            ] = space_config.split('=')
            if configured_space_key == space_key:
                return int(configured_page_id)

        return 0
# pylint: enable=too-few-public-methods


def view_page_url(base_url, page_id):
    """
    Gets the URL of a Confluence page
    """
    return f"https://{base_url}.atlassian.net/wiki/pages/viewpage.action?pageId={page_id}"


def add_decisions_label(base_url, new_page_id, auth):
    """
    Adds the 'decisions' label to the newly created page.
    """
    print('Marking page with label decisions')
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


def link_from_jira_to_confluence(base_url, issue_key, new_page_id, auth):
    """
    Adds a link in the JIRA ticket that points to the newly created Confluence page.
    """
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
            'key': extract_space_key(issue_key)
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
    add_decisions_label(base_url, new_page_id, auth)

    # create link from jira to confluence page
    link_from_jira_to_confluence(base_url, issue_key, new_page_id, auth)
    return create_page_response


def lambda_handler_with_environment(event, environment):
    '''
    Processes the JIRA event
    '''
    print('Received event')
    print(event)
    print('Parsing body')
    body = json.loads(event['body'])
    print('Extracting data')
    issue_key = body['issue']['key']
    summary = body['issue']['fields']['summary']
    print(f'Found key {issue_key} with summary {summary}')
    print('Creating options')
    options = Options(environment)

    if 'KDD' in summary:
        return create_page(options, issue_key, summary)

    return {
        'result': 'Not a KDD issue'
    }

# pylint: disable=unused-argument


def lambda_handler(event, context):
    """
    Gets updates from JIRA when an issue is created.
    """
    return lambda_handler_with_environment(event, os.environ)
# pylint: enable=unused-argument
