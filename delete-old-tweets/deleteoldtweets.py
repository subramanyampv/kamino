#!/usr/local/bin/python
'''
Deletes old tweets.
'''

import sys
import time
import tweepy

CONSUMER_KEY = ""
CONSUMER_SECRET = ""
ACCESS_TOKEN_KEY = ""
ACCESS_TOKEN_SECRET = ""


def main():
    '''
    main function
    '''
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET)

    api = tweepy.API(auth)

    def print_tweet(status):
        '''
        prints a tweet
        '''
        print(status.id_str)
        print(status.created_at)
        print(status.text)
        if status.text.startswith('RT @') and status.created_at.year <= 2012:
            print("Automatically deleting old RT")
            # api.destroy_status(id = status.id)

        print("")
        print("")

    def fetch_old_tweets(max_id):
        '''
        fetches old tweets
        '''
        time.sleep(5)

        if max_id > 0:
            tweets = api.user_timeline(max_id=max_id, count=200)
        else:
            tweets = api.user_timeline(count=200)

        total = 0
        oldest_id = 0

        for status in tweets:
            total = total + 1
            print_tweet(status)
            oldest_id = status.id

        return total, oldest_id

    max_id = 0
    if len(sys.argv) >= 2:
        max_id = int(sys.argv[1])

    oldest_id = 0
    total = 0
    eof = False
    api_calls = 0

    try:
        while not eof:
            api_calls = api_calls + 1
            local_total, oldest_id = fetch_old_tweets(max_id)
            total = total + local_total
            if oldest_id > 0:
                # we had some last result, next time we'll continue from that one
                max_id = oldest_id - 1
            else:
                # just substract maxcount
                max_id = max_id - 200

            eof = max_id <= 0
    finally:
        print("")
        print("Total tweets:", total)
        print("Total api calls:", api_calls)
        print("Max ID:", max_id)
        print("")


if __name__ == "__main__":
    main()
