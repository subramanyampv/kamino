#!/usr/bin/python

import os

# takes a path like /mypath/.../A-B and moves it to /mypath/.../A/B
def processFile(strPath):
	head, tail = os.path.split(strPath)
	a = tail.split("-")
	if len(a) > 1:
		del a[0]
		a[0] = a[0].strip()
		os.rename(strPath, os.path.join(head, "-".join(a)))
		
if os.environ.has_key('NAUTILUS_SCRIPT_SELECTED_FILE_PATHS'):
	s = os.environ['NAUTILUS_SCRIPT_SELECTED_FILE_PATHS']
	fileList = s.splitlines()
		
	for k in fileList:
		processFile(k)
