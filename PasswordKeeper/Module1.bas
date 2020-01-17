Attribute VB_Name = "Module1"
Option Explicit

' System Entry Types
Global Const ENTRY_TYPE_EMAIL_PWD = 1
Global Const ENTRY_TYPE_OTHER_PWD = 2
Global Const ENTRY_TYPE_FTPSITE_PWD = 3

' Other Constants
Global Const LISTVIEW_MODE0 = "View Large Icons"
Global Const LISTVIEW_MODE1 = "View Small Icons"
Global Const LISTVIEW_MODE2 = "View List"
Global Const LISTVIEW_MODE3 = "View Details"


Public fMainForm As frmMain

Public Function EntryTypeToString(EntryType As Integer) As String
    Select Case EntryType
        Case ENTRY_TYPE_EMAIL_PWD
            EntryTypeToString = "E-mail"
        Case ENTRY_TYPE_OTHER_PWD
            EntryTypeToString = "Other"
        Case ENTRY_TYPE_FTPSITE_PWD
            EntryTypeToString = "FTP Site"
        Case Else
            EntryTypeToString = ""
    End Select
End Function

Public Function EntryTypeToForm(EntryType As Integer) As Form
    Select Case EntryType
        Case ENTRY_TYPE_EMAIL_PWD
            Set EntryTypeToForm = New frmEmailPwd
        Case ENTRY_TYPE_OTHER_PWD
            Set EntryTypeToForm = New frmOtherPwd
        Case ENTRY_TYPE_FTPSITE_PWD
            Set EntryTypeToForm = New frmFTPSitePwd
        Case Else
            Set EntryTypeToForm = Nothing
    End Select
End Function

Public Function EntryTypeToObject(EntryType As Integer) As Object
    Select Case EntryType
        Case ENTRY_TYPE_EMAIL_PWD
            Set EntryTypeToObject = New clsEmailPwd
        Case ENTRY_TYPE_OTHER_PWD
            Set EntryTypeToObject = New clsOtherPwd
        Case ENTRY_TYPE_FTPSITE_PWD
            Set EntryTypeToObject = New clsFTPSitePwd
        Case Else
            Set EntryTypeToObject = Nothing
    End Select
End Function

Sub Main()
    Dim fLogin As New frmLogin
    fLogin.Show vbModal
    If Not fLogin.OK Then
        'Login Failed so exit app
        End
    End If
    Unload fLogin


    frmSplash.Show
    frmSplash.Refresh
    Set fMainForm = New frmMain
    Load fMainForm
    Unload frmSplash


    fMainForm.Show
End Sub

