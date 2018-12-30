# git-analyze
Analyze git repositories and gather statistical information about the code

[![Build Status](https://travis-ci.org/ngeor/git-analyze.svg?branch=master)](https://travis-ci.org/ngeor/git-analyze)

## Usage

```
python git-analyze.py --since SINCE --metric {commits,files}
```

### Parameters

- `--since` is mandatory. It accepts the ISO formatted date since when analysis will start (e.g. 2017-01-01)
- `--metric` determines what kind of report will be produced.

## Example

To get a CSV report listing commits per month you can run:

```
python git-analyze.py --since 2016-01-01 --metric commits
```

Which will print a report like this one:

```
2016-1-01,2016-2-01,9
2016-2-01,2016-3-01,4
2016-3-01,2016-4-01,40
2016-4-01,2016-5-01,10
2016-5-01,2016-6-01,19
2016-6-01,2016-7-01,7
2016-7-01,2016-8-01,21
2016-8-01,2016-9-01,24
2016-9-01,2016-10-01,19
2016-10-01,2016-11-01,8
2016-11-01,2016-12-01,8
2016-12-01,2017-1-01,14
2017-1-01,2017-2-01,13
2017-2-01,2017-3-01,0
2017-3-01,2017-4-01,0
```
