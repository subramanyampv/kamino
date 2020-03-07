@ECHO ON

REM turn archive bit off everywhere
REM attrib -A /S /D .

REM reset indexing bit
REM attrib -I /S /D .

REM remove indexing from these
REM attrib +I /S /D Archive
REM attrib +I /S /D .npm
REM attrib +I /S /D .m2
REM attrib +I /S /D Projects
REM attrib +I /S /D AppData
REM attrib +I /S /D vbox

REM make Archive read-only
REM attrib +R /S /D Archive

REM disable compression everywhere
compact /I /Q /U /A /S:C:\

REM enable compression in these folders
compact /Q /C /A /S:Archive
compact /Q /C /A /S:AppData
compact /Q /C /A /S:Projects
