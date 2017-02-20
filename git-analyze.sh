#!/bin/bash

# Prints usage of this program
function help() {
    echo "$0 COMMAND OPTIONS"
    echo "COMMAND is one of:"
    echo "  commits"
    echo "  merges"
    echo "  files"
    echo "OPTIONS:"
    echo "--work-tree=<path>"
    echo "--git-dir=<path>"
}

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
    git $GIT_ARGS rev-list --since=$since --until=$until master | wc -l
}

# Prints the git merge commits between two dates
# @param since
# @param until
function mergesBetweenDates() {
    local since=$1
    local until=$2
    git $GIT_ARGS rev-list --since=$since --until=$until --merges master | wc -l
}

# Prints the oldest git commit between two dates
# @param since
# @param until
function oldestCommitBetweenDates() {
    local since=$1
    local until=$2
    git $GIT_ARGS rev-list --since=$since --until=$until master | tail -n 1
}

# Iterates over a time period in month increments.
# Calls the given function on each iteration.
# Prints the dates and the function's result per iteration.
# @param fn - The function to call.
function printCommitsPerMonth() {
    local fn=$1
    local years=(2010 2011 2012 2013 2014 2015 2016 2017)
    local months=(1 2 3 4 5 6 7 8 9 10 11 12)
    local year=0
    local month=0
    local since=""
    local until=""

    for year in "${years[@]}"; do
        for month in "${months[@]}"; do
            since="$year-$month-01"
            until=$(untilDate $year $month)
            number=$($fn $since $until)
            echo "$since,$until,$number"
        done
    done
}

# Iterates over a time period in month increments.
# For every month, it finds the oldest commit and checks out the code
# at that point in time.
# Calls the given function on each iteration.
# @param fn - The function to call.
function checkoutPerMonth() {
    local fn=$1
    local years=(2010 2011 2012 2013 2014 2015 2016 2017)
    local months=(1 2 3 4 5 6 7 8 9 10 11 12)
    local year=0
    local month=0
    local since=""
    local until=""
    local commitId=""
    local commitDate=""
    for year in "${years[@]}"; do
        for month in "${months[@]}"; do
            since="$year-$month-01"
            until=$(untilDate $year $month)
            commitId=$(oldestCommitBetweenDates $since $until)
            if [ -n "$commitId" ]; then
                git $GIT_ARGS checkout -q $commitId
                commitDate=$(git $GIT_ARGS show -s --format=%ci $commitId | cut -d' ' -f1)
                $fn $since $until $commitDate
            fi
        done
    done
}

# Calculates number of files and LOC
# @param since
# @param until
# @param commitDate
function filesPerMonth() {
    local since=$1
    local until=$2
    local commitDate=$3

    # -not -path "*/\.*" excludes hidden paths e.g. .git folder
    # -not -path "*/node_modules/*" excludes node_modules folder in case it's a working copy
    # piping it through file to get the mime-type in order to exclude binary files.
    # The output of file is something like my/file.txt: text charset=utf8 for text files (will not contain 'text' for binary files)
    local fileCount=$(find $WORK_TREE -type f -not -path "*/\.*" -not -path "*/node_modules/*" -exec file \{\} \; | grep text | wc -l)
    local lineCount=$(find $WORK_TREE -type f -not -path "*/\.*" -not -path "*/node_modules/*" -exec file \{\} \; | grep text | cut -d: -f1 | xargs cat | wc -l)
    echo "$since,$until,$commitDate,$fileCount,$lineCount"
}

function runCommitsPerMonth() {
    echo "Since,Until,Commit Count"
    printCommitsPerMonth commitsBetweenDates
}

function runMergesPerMonth() {
    echo "Since,Until,Merge Count"
    printCommitsPerMonth mergesBetweenDates
}

function runFilesPerMonth() {
    echo "Since,Until,Commit Date,File Count,LOC"
    checkoutPerMonth filesPerMonth
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
GIT_ARGS=

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

if [ -n "$WORK_TREE" ]; then
    GIT_ARGS="--work-tree=$WORK_TREE"
else
    WORK_TREE=. # for other commands e.g. find $WORK_TREE -type f
fi

if [ -n "$GIT_DIR" ]; then
    GIT_ARGS="$GIT_ARGS --git-dir=$GIT_DIR"
fi

case $COMMAND in
    commits)
    runCommitsPerMonth
    ;;
    merges)
    runMergesPerMonth
    ;;
    files)
    runFilesPerMonth
    ;;
    *)
    echo "Unknown command $COMMAND"
    help
    exit 1
    ;;
esac

# TODO find date of oldest commit:
# $ git show -s --format=%ci $(git rev-list --max-parents=0 HEAD) | cut -d' ' -f1
# 2017-02-18
