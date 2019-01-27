@ECHO OFF
IF /I "%1"=="up" (
	mklink "%USERPROFILE%\.bash_aliases" "%CD%\bash_aliases"
	mklink "%USERPROFILE%\.clang-format" "%CD%\clang-format"
	mklink "%USERPROFILE%\.hyper.js" "%CD%\hyper.js"
	GOTO:EOF
)

IF /I "%1"=="down" (
	DEL "%USERPROFILE%\.bash_aliases"
	DEL "%USERPROFILE%\.clang-format"
	DEL "%USERPROFILE%\.hyper.js"
	GOTO:EOF
)

ECHO Please run with up or down as parameter
