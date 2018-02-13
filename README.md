# kddbot
A bot that automatically creates a Confluence page when a Jira ticket is created.

## Requirements

- Atlassian Cloud instance
- AWS Lambda and AWS API Gateway
- Python 3.6
- requests python module

## Preparing deployment package

- Run `pip install -t .` in the working directory.
- Create a zip file including the code and the dependencies. The zip file should not have a top-level folder.

## Create AWS Lambda Function

Select the following options:

- Name: kddbot
- Runtime: Python 3.6
- Role: Create new role from template
- Role name: kddbot

## Upload deployment package

- Edit the lambda function
- Select Code Entry Type: Upload a zip file
- Upload the zip file
- Save function

## Set environment variables

Environment Variables:

* ATLASSIAN_CLOUD_NAME: The name of the Atlassian Cloud site (only the name, before `.atlassian.net`)
* USERNAME and PASSWORD: Credentials for Basic Authentication
* SPACE_KEY: The key in which pages will be created
* PARENT_PAGE_ID: The parent page of the newly created pages

Save the function after editing the environment variables.

## Create API Gateway

- Create new API Gateway
- Select New API with name kddbot
- Add POST method on the / resource.
- Configure POST method on the / resource to call the kddbot Lambda function.
- Deploy the API on a new stage named prod

This provides the HTTPS endpoint that needs to be configured in Jira.

## Configure Jira WebHook

- Configure WebHooks in Jira (System -> Advanced -> WebHooks)
- Create a new WebHook with name kddbot
- The URL should be the URL of the API Gateway
- Select to listen on Issue Created events
