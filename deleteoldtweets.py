#!/usr/local/bin/python
import sys
import time
import tweepy

consumer_key = ""
consumer_secret = ""
access_token_key = ""
access_token_secret = ""
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token_key, access_token_secret)

api = tweepy.API(auth)
api_calls = 0

def printTweet(status):
	print status.id_str
	print status.created_at
	print status.text
	if status.text.startswith('RT @') and status.created_at.year <= 2012:
		print "Automatically deleting old RT"
		api.destroy_status(id = status.id)

	print ""
	print ""


def fetchOldTweets(max_id):
	global api_calls
	api_calls = api_calls + 1

	# print "Call #", api_calls, " max_id", max_id, "sleep 5'' first..."
	time.sleep(5)

	if max_id > 0:
		tweets = api.user_timeline(max_id = max_id, count = 200)
	else:
		tweets = api.user_timeline(count = 200)

	total = 0
	oldest_id = 0

	for status in tweets:
		total = total + 1
		printTweet(status)
		oldest_id = status.id

	return total, oldest_id


max_id = 0
if len(sys.argv) >= 2:
	max_id = long(sys.argv[1])

oldest_id = 0
total = 0
eof = False


try:
	while not eof:
		local_total, oldest_id = fetchOldTweets(max_id)
		total = total + local_total
		if oldest_id > 0:
			# we had some last result, next time we'll continue from that one
			max_id = oldest_id - 1
		else:
			# just substract maxcount
			max_id = max_id - 200

		eof = max_id <= 0
finally:
	print ""
	print "Total tweets:", total
	print "Total api calls:", api_calls
	print "Max ID:", max_id
	print ""
