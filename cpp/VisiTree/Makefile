all: VisiTree.exe

clean:
	del *.obj *.res *.exe *.pdb *.ilk

VisiTree.res: VisiTree.rc
	rc.exe VisiTree.rc

VisiTree.exe: VisiTree.res *.cpp
	cl.exe /D_UNICODE /DUNICODE /EHsc /Zi /Fe: VisiTree.exe user32.lib gdi32.lib kernel32.lib comdlg32.lib VisiTree.res *.cpp
