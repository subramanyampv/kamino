#!/bin/bash

# Prints the first date of the next month, given a month and year.
# @param year
# @param month
function untilDate() {
	local year=$1
	local month=$2
	if [ $month -eq 12 ]; then
		year=$((year + 1))
		month=1
	else
		month=$((month + 1))
	fi
	echo "$year-$month-01"
}

# Prints the git commits between two dates
# @param since
# @param until
function commitsBetweenDates() {
	local since=$1
	local until=$2
	git --work-tree=$WORK_TREE --git-dir=$GIT_DIR rev-list --since=$since --until=$until master | wc -l
}

# Prints the git merge commits between two dates
# @param since
# @param until
function mergesBetweenDates() {
	local since=$1
	local until=$2
	git --work-tree=$WORK_TREE --git-dir=$GIT_DIR rev-list --since=$since --until=$until --merges master | wc -l
}

# Prints the oldest git commit between two dates
# @param since
# @param until
function oldestCommitBetweenDates() {
	local since=$1
	local until=$2
	git --work-tree=$WORK_TREE --git-dir=$GIT_DIR rev-list --since=$since --until=$until master | tail -n 1
}

function printCommitsPerMonth() {
	local fn=$1
	local years=(2016 2017) # 2015 2014 2013 2012 2011)
	local months=(1 2 3 4 5 6 7 8 9 10 11 12)
	local year=0
	local month=0
	local since=''
	local until=''
	local commitsPerMonth=''

	for year in "${years[@]}"; do
		for month in "${months[@]}"; do
			since="$year-$month-01"
			until=$(untilDate $year $month)
			number=$($fn $since $until)
			echo "$since,$until,$number"
		done
	done
}

function runCommitsPerMonth() {
	printCommitsPerMonth commitsBetweenDates
}

function runMergesPerMonth() {
	printCommitsPerMonth mergesBetweenDates
}

function runOldestCommitPerMonth() {
	printCommitsPerMonth oldestCommitBetweenDates
}

#
# git-analyze.sh COMMAND OPTIONS
# COMMAND is one of
# - commits-per-month
# - merges-per-month
# OPTIONS:
# --work-tree=<path> point to a different git folder
# --git-dir=<path> point to a different git folder

COMMAND=$1
WORK_TREE=
GIT_DIR=

shift # skip command argument
for key in "$@"; do
	case $key in
		--work-tree=*)
			WORK_TREE="${key#*=}"
			;;
		--git-dir=*)
			GIT_DIR="${key#*=}"
			;;
		*)
			echo "Unknown parameter $key"
			exit 1
			;;
	esac
done

case $COMMAND in
	commits-per-month)
		runCommitsPerMonth
		;;
	merges-per-month)
		runMergesPerMonth
		;;
	oldest-per-month)
		runOldestCommitPerMonth
		;;
	*)
		echo "Unknown command $COMMAND"
		exit 1
esac

#commitsPerMonth=$(getCommitsPerMonth)
#for commit in $commitsPerMonth; do
#	git checkout $commit
#	git show -s --format=%ci $1 | cut -d' ' -f1
#	find . -type f | wc -l
#done
