# git-analyze
Analyze git repositories and gather statistical information about the code

## Usage

```
git-analyze.sh COMMAND OPTIONS
```

COMMAND is one of:

- commits-per-month
- merges-per-month

OPTIONS are:

- --work-tree=<path>
- --git-dir=<path>

## Example

To get a CSV report listing merges per month you can run:

```
git-analyze.sh merges-per-month --work-tree=../my-project/ --git-dir=../my-project/.git/
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
