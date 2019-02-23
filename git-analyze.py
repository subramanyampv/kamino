#!/usr/bin/env python

import argparse
import os
from datetime import date, datetime
from git import Git


def parse_args(args=None):
    '''
    Parses CLI arguments
    '''
    parser = argparse.ArgumentParser(description='Git Analyzer')
    parser.add_argument('--since', help='The start date of the analysis')
    parser.add_argument(
        '--metric',
        choices=['commits', 'files'],
        default='commits',
        help='The metric to report on')
    return parser.parse_args(args)


def next_month(dt):
    if dt.month == 12:
        return date(dt.year + 1, 1, 1)
    else:
        return date(dt.year, dt.month + 1, 1)


def generate_date_range(since):
    stop = date.today()
    i = since
    while i < stop:
        yield i
        i = next_month(i)


def wc(str):
    return len(str.splitlines())


def print_commits(date_range):
    '''
    Print commit counts per month
    '''
    print('Since,Until,Commit Count')
    git = Git()
    for dt in date_range:
        since, until = dt, next_month(dt)
        result = git.rev_list(since, until)
        print(f'{since},{until},{wc(result)}')


def oldest_commit_between_dates(since, until):
    git = Git()
    result = git.rev_list(since, until, reverse=True)
    lines = result.splitlines()
    return lines[0] if len(lines) > 0 else ''


def count_files(path, visitor, result):
    with os.scandir(path) as it:
        for entry in it:
            if entry.is_file():
                result = visitor(result, path, entry.name)
            elif entry.is_dir() and not entry.name.startswith('.'):
                result = count_files(os.path.join(
                    path, entry.name), visitor, result)
    return result


def file_counter(result, path, name):
    return result + 1


def loc(file):
    try:
        with open(file, "r", 1, 'utf-8') as f:
            return len(f.readlines())
    except:
        return 0


def loc_counter(result, path, name):
    return result + loc(os.path.join(path, name))


def composite_counter(result, path, name):
    result['file'] = file_counter(result['file'], path, name)
    result['loc'] = loc_counter(result['loc'], path, name)
    return result


def print_files(date_range):
    git = Git()
    print('Since,Until,Commit Date,File Count,LOC')
    for dt in date_range:
        since, until = dt, next_month(dt)
        oldest_commit_id = oldest_commit_between_dates(since, until)
        if oldest_commit_id:
            git.checkout(oldest_commit_id)
            oldest_commit_date = git.commit_date(oldest_commit_id)

            stats = {
                'file': 0,
                'loc': 0
            }
            stats = count_files('.', composite_counter, stats)
            # TODO COUNT FILES and LOC
            print(
                f'{since},{until},{oldest_commit_date},{stats["file"]},{stats["loc"]}')

    git.checkout('master')


def main():
    args = parse_args()
    # TODO find date of oldest commit:
    # $ git show -s --format=%ci $(git rev-list --max-parents=0 HEAD) | cut -d' ' -f1
    # 2017-02-18
    since = datetime.strptime(args.since, '%Y-%m-%d').date()
    date_range = generate_date_range(since)
    metric = args.metric
    if metric == 'commits':
        print_commits(date_range)
    elif metric == 'files':
        print_files(date_range)
    else:
        raise KeyError('Unsupported metric ' + metric)


if __name__ == '__main__':
    main()
