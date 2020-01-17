Attribute VB_Name = "GenUtilities"
Option Explicit

Global Const BIF_RETURNONLYFSDIRS = 1

Public Type BROWSEINFO
    hwndOwner As Long
    pidlRoot As Long
    pszDisplayName As String
    lpszTitle As String
    ulFlags As Long
    lpfn As Long
    lParam As Long
    iImage As Long
End Type

'constants for the open file common dialog
Public Const SingleOpenFlag = 524288 + 6144
Public Const MultiOpenFlag = SingleOpenFlag + 512

Public Declare Function SHBrowseForFolder Lib "shell32" Alias "SHBrowseForFolderA" (bi As BROWSEINFO) As Long
Public Declare Function SHGetPathFromIDList Lib "shell32" Alias "SHGetPathFromIDListA" (ByVal pidl As Long, ByVal pszPath As String) As Long
Public Declare Sub CoTaskMemFree Lib "ole32" (ByVal p As Long)

'function SHGetPathFromIDListA(pidl: PItemIDList; pszPath: PAnsiChar): BOOL; stdcall;

Public Function GetFileName(ByVal s As String) As String
    Dim i As Integer, n As Integer
    Dim R As String
    R = s
    n = Len(R)
    For i = n To 1 Step -1
        If Mid(R, i, 1) = ":" Or Mid(R, i, 1) = "\" Then Exit For
    Next
    If i > 0 Then R = Mid(R, i + 1, n - i)
    GetFileName = R
End Function

Public Function GetFilePath(ByVal s As String) As String
    Dim i As Integer, n As Integer
    Dim R As String
    R = s
    n = Len(R)
    For i = n To 1 Step -1
        If Mid(R, i, 1) = ":" Or Mid(R, i, 1) = "\" Then Exit For
    Next
    If i > 0 Then R = Mid(R, 1, i - 1)
    GetFilePath = R
End Function

Public Function GetFileTitle(ByVal s As String) As String
    GetFileTitle = TrimFileExt(GetFileName(s))
End Function

Public Function IsFileError(value As Integer) As Boolean
    IsFileError = (value = 53) Or (value = 57) Or (value = 68) Or (value = 70) Or (value = 71) Or (value = 75) Or (value = 76)
End Function

Public Function Max(ByVal x As Integer, ByVal y As Integer) As Integer
    Max = IIf(x > y, x, y)
End Function

Public Function Min(ByVal x As Integer, ByVal y As Integer) As Integer
    Min = IIf(x < y, x, y)
End Function

Public Function ReplaceExt(ByVal Filename As String, NewExt As String) As String
    Dim i As Integer
    i = Len(Filename)

    Do
        If Mid(Filename, i, 1) = "." Then Exit Do
        i = i - 1
    Loop Until i <= 0

    If i > 0 Then
        ReplaceExt = Left(Filename, i) & NewExt
    Else
        ReplaceExt = Filename & "." & NewExt
    End If
End Function

Public Sub ShowErr()
    MsgBox Err.Description & vbCrLf & "Κωδικός σφάλματος: " & CStr(Err.Number), vbCritical
End Sub

Public Function Slashed(ByVal s As String) As String
    If Right(s, 1) <> "\" Then
        Slashed = s + "\"
    Else
        Slashed = s
    End If
End Function

Public Function UnSlashed(ByVal s As String) As String
    If Right(s, 1) = "\" Then
        UnSlashed = Left(s, Len(s) - 1)
    Else
        UnSlashed = s
    End If
End Function

Public Function TrimFileExt(ByVal s As String) As String
    Dim n As Integer, i As Integer
    n = Len(s)
    For i = n To 1 Step -1
        If Mid(s, i, 1) = "." Then Exit For
    Next
    If i > 0 Then
        TrimFileExt = Mid(s, 1, i - 1)
    Else
        TrimFileExt = s
    End If
End Function

'Public Sub Collection_Clear(AC As Collection)
'    Dim i As Integer
'    For i = AC.Count To 1 Step -1
'        'If IsObject(AC.Item(i)) Then Set AC.Item(i) = Nothing
'        AC.Remove i
'    Next
'End Sub

Public Function IsImageFileExt(s As String) As Boolean
    If UCase(Right(s, 4)) = ".JPG" Then
        IsImageFileExt = True
    ElseIf UCase(Right(s, 5)) = ".JPEG" Then
        IsImageFileExt = True
    ElseIf UCase(Right(s, 4)) = ".BMP" Then
        IsImageFileExt = True
    ElseIf UCase(Right(s, 4)) = ".GIF" Then
        IsImageFileExt = True
    ElseIf UCase(Right(s, 4)) = ".WMF" Then
        IsImageFileExt = True
    ElseIf UCase(Right(s, 4)) = ".EMF" Then
        IsImageFileExt = True
    Else
        IsImageFileExt = False
    End If
End Function

Public Function IsTextFileExt(s As String) As Boolean
    If UCase(Right(s, 4)) = ".TXT" Then
        IsTextFileExt = True
    ElseIf UCase(Right(s, 4)) = ".RTF" Then
        IsTextFileExt = True
    Else
        IsTextFileExt = False
    End If
End Function

Public Function IsSet(k As Object) As Boolean
    IsSet = TypeName(k) <> "Nothing"
End Function

Public Function BrowseForFolder(Wnd As Long, Path As String) As Boolean
    Dim bi As BROWSEINFO
    Dim ret As Long
    bi.hwndOwner = Wnd
    bi.lpfn = 0
    bi.pidlRoot = 0
    bi.ulFlags = BIF_RETURNONLYFSDIRS
    ret = SHBrowseForFolder(bi)
    If ret <> 0 Then
        Path = Space(260)
        SHGetPathFromIDList ret, Path
        CoTaskMemFree ret
        BrowseForFolder = True
    Else
        BrowseForFolder = False
    End If
End Function

Public Function FindKeyInTable(t() As String, key As String, count As Integer, comparemethod As VbCompareMethod) As Integer
    Dim a As Integer, b As Integer, m As Integer, k As Integer
    a = 1
    b = count

    While a < b
        If StrComp(t(a), key, comparemethod) = 0 Then
            FindKeyInTable = a
            Exit Function
        End If
        If StrComp(t(b), key, comparemethod) = 0 Then
            FindKeyInTable = b
            Exit Function
        End If
        m = (a + b) \ 2
        k = StrComp(t(m), key, comparemethod)
        If k = 0 Then
            FindKeyInTable = m
            Exit Function
        ElseIf k > 0 Then
            b = m - 1
        Else
            a = m + 1
        End If
    Wend
    If StrComp(t(a), key, comparemethod) = 0 Then
        FindKeyInTable = a
    Else
        FindKeyInTable = -1
    End If
End Function

Public Sub ClearCollection(c As Collection)
    Dim i As Integer
    For i = c.count To 1 Step -1
        c.Remove i
    Next
End Sub

Public Sub ClearObjCollection(c As Collection)
    Dim i As Integer
    Dim k As Object
    For i = c.count To 1 Step -1
        Set c(i) = Nothing
        
        c.Remove i
    Next
End Sub

