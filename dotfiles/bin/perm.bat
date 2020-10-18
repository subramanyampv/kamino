@ECHO ON

REM turn archive bit off everywhere
attrib -A /S /D .

REM reset indexing bit
attrib -I /S /D .

REM remove indexing from these
attrib +I /S /D Archive
attrib +I /S /D .npm
attrib +I /S /D .m2
attrib +I /S /D Projects
attrib +I /S /D AppData
attrib +I /S /D vbox

REM make Archive read-only
attrib +R /S /D Archive

REM disable compression everywhere
REM compact /I /Q /U /A /S:C:\

REM enable compression in these folders
compact /Q /C /A /S:Archive
compact /Q /C /A /S:AppData
compact /Q /C /A /S:Projects

REM external drives disable compression
compact /I /Q /U /A /S:E:\
compact /I /Q /U /A /S:F:\
