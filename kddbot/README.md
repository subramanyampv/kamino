# kddbot
A bot that automatically creates a Confluence page when a Jira ticket is created.

[![Build Status](https://travis-ci.org/ngeor/kddbot.svg?branch=master)](https://travis-ci.org/ngeor/kddbot)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/kddbot/badge.svg?branch=master)](https://coveralls.io/github/ngeor/kddbot?branch=master)

![kddbot logo](kddbot-256px.png?raw=true)

## Overview

Whenever a ticket is created in Jira Cloud with the word 'KDD' (Key Decision Document) in its summary, kddbot will
create a Confluence decision page with the same title and link the Jira issue with the newly created Confluence page.

This saves a couple of clicks and promotes consistency. Without kddbot, you'd have to:

- create the issue
- create the confluence page
- go to the issue page and the link it to the confluence page (which needs some clicks)

## Requirements

- Atlassian Cloud instance
- AWS Lambda and AWS API Gateway
- Python 3.6
- requests python module

## Installation

### Preparing deployment package

- Run `pip install -r requirements.txt -t .` in the working directory.
- Create a zip file including the code and the dependencies. The zip file should not have a top-level folder (e.g. `zip -r ../kddbot.zip *`)

### Create AWS Lambda Function

Select the following options:

- Name: kddbot
- Runtime: Python 3.6
- Role: Create new role from template
- Role name: kddbot

### Upload deployment package

- Edit the lambda function
- Select Code Entry Type: Upload a zip file
- Upload the zip file
- Save function

### Set environment variables

Environment Variables:

* ATLASSIAN_CLOUD_NAME: The name of the Atlassian Cloud site (only the name, before `.atlassian.net`)
* USERNAME and PASSWORD: Credentials for Basic Authentication
* SPACES: Configures the parent page IDs under which the new pages will be created. The format is:
  `SPACE_KEY_1=PARENT_PAGE_ID_1,SPACE_KEY_2=PARENT_PAGE_ID_2,...`

Save the function after editing the environment variables.

### Create API Gateway

- Create new API Gateway
- Select New API with name kddbot
- Add POST method on the / resource.
- Configure POST method on the / resource to call the kddbot Lambda function.
- Deploy the API on a new stage named prod

This provides the HTTPS endpoint that needs to be configured in Jira.

### Configure Jira WebHook

- Configure WebHooks in Jira (System -> Advanced -> WebHooks)
- Create a new WebHook with name kddbot
- The URL should be the URL of the API Gateway
- Select to listen on Issue Created events

## Limitations

The Confluence Cloud REST API currently does not offer a way of creating
a page based on a template or a blueprint. Therefore, the template that
is used is hard-coded in the Python code of kddbot.

## Resources

- [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/)
- [Confluence Cloud REST API](https://developer.atlassian.com/cloud/confluence/rest/)

## Sequence Diagram

![Sequence Diagram](docs/sequence-diagram.png?raw=true "Sequence Diagram")

<!-- title KDDBot

JIRA WebHook->AWS API Gateway: POST request
AWS API Gateway->AWS Lambda Function: execute lambda
AWS Lambda Function->Confluence Cloud REST API: create page
AWS Lambda Function->Confluence Cloud REST API: add label to page
AWS Lambda Function->JIRA Cloud REST API: link issue with page -->

## Configuring Visual Studio Code

To see all `pylint` messages in Visual Studio Code, make sure you have this
setting in your workspace settings:

```
    "python.linting.pylintUseMinimalCheckers": false
```
