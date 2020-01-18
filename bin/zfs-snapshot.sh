#!/bin/sh

# put zfs on the path
PATH=$PATH:/sbin

# takes a snapshot on the given filesystem
# the snapshot name is the current date

SNAPSHOT_NAME=`date +%Y%m%d%H%M%S`

#echo $SNAPSHOT_NAME

FILESYSTEM=$1

if [ -z $FILESYSTEM ]; then
	echo "Syntax $0 filesystem"
	return 1
fi

#echo $FILESYSTEM

TEST1=`zfs list -t filesystem $FILESYSTEM `

if [ ! $? -eq 0 ]; then
	echo "zfs failed"
	exit 1
fi

SNAPSHOT_LIST=`zfs list -H -o name -t snapshot -r $FILESYSTEM | sort`

if [ ! $? -eq 0 ]; then
	echo "zfs failed"
	exit 1
fi

#echo $SNAPSHOT_LIST

if [ -z "`echo $SNAPSHOT_LIST | grep $SNAPSHOT_NAME`" ]; then
	zfs snapshot $FILESYSTEM@$SNAPSHOT_NAME
else
	echo "Snapshot $FILESYSTEM@$SNAPSHOT_NAME already exists"
	exit 1
fi
