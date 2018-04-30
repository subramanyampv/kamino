import os
import json
import requests
from requests.auth import HTTPBasicAuth

def create_page(issue_key, summary):
    data = {
        'ancestors': [
            { 'id': os.environ['PARENT_PAGE_ID'] }
        ],
        'body': {
            'storage': {
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
            'key': os.environ['SPACE_KEY']
        },
        'status': 'current',
        'title': summary,
        'type': 'page'
    }

    auth = HTTPBasicAuth(os.environ['USERNAME'], os.environ['PASSWORD'])
    base_url = os.environ['ATLASSIAN_CLOUD_NAME']

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
    json = result.json()
    new_page_id = json['id']
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
    print('Linking from jia to confluence')
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
                "url": f"https://{base_url}.atlassian.net/wiki/pages/viewpage.action?pageId={new_page_id}",
                "title": "Wiki Page"
            }
        }
    )
    result.raise_for_status()
    return json

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
    if 'KDD' in summary:
        return create_page(issue_key, summary)
    else:
        return { 'result': 'Not a KDD issue' }
