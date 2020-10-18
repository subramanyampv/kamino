chm-helper
==========

Helper for chm files

Requirements
------------

[Microsoft Help Workshop](https://www.microsoft.com/en-us/download/details.aspx?id=21138) needs to be installed

Building
--------

The python script can generate the required files that Help Workshop needs.

```powershell
& 'C:\Program Files (x86)\HTML Help Workshop\hhc' .\example.hhp
```

Files
-----

- `example.hhp` the main file of the project
- `index.hhk` the index file
- `toc.hhc` the table of contents
