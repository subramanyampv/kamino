#!/usr/bin/python

import os

# makes a directory and does not complain if it exists
def mkdir_noerr(strPath):
	if not(os.path.exists(strPath)):
		os.mkdir(strPath)

# takes a path like /mypath/.../A-B and moves it to /mypath/.../A/B
def processFile(strPath):
	head, tail = os.path.split(strPath)
	a = tail.split("-")
	if len(a) > 1:
		newpath = os.path.join(head, a[0].rstrip())
		mkdir_noerr(newpath)
		del a[0]
		a[0] = a[0].lstrip()
		os.rename(strPath, os.path.join(newpath, "-".join(a)))
		
if os.environ.has_key('NAUTILUS_SCRIPT_SELECTED_FILE_PATHS'):
	s = os.environ['NAUTILUS_SCRIPT_SELECTED_FILE_PATHS']
	fileList = s.splitlines()
		
	for k in fileList:
		processFile(k)
