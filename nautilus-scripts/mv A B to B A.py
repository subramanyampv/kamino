#!/usr/bin/python

import os

# takes a path like /mypath/.../A B and returns /mypath/.../B A
def reverseIt(strPath):
	head, tail = os.path.split(strPath)
	a = tail.split(" ")
	if len(a) > 2:
		a = [a[1]] + [a[0]] + a[2:]
		reversed = " ".join(a)
	elif len(a) > 1:
		reversed = a[1] + " " + a[0]
	else:
		reversed = tail
	return os.path.join(head, reversed)
		
if os.environ.has_key('NAUTILUS_SCRIPT_SELECTED_FILE_PATHS'):
	s = os.environ['NAUTILUS_SCRIPT_SELECTED_FILE_PATHS']
	fileList = s.splitlines()
		
	for k in fileList:
		os.rename(k, reverseIt(k))

