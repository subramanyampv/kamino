VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsEmailPwd"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Attribute VB_Ext_KEY = "SavedWithClassBuilder6" ,"Yes"
Attribute VB_Ext_KEY = "Top_Level" ,"Yes"
Option Explicit


'local variable(s) to hold property value(s)
Private mvarAccountName As String 'local copy
Private mvarUserName As String 'local copy
Private mvarPassword As String 'local copy
Private mvarEmailAddress As String 'local copy
Private mvarKey As String

Public Property Get EntryType() As Integer
    EntryType = ENTRY_TYPE_EMAIL_PWD
End Property

Public Sub SaveEntry(FileNo As Integer)
    Print #FileNo, mvarAccountName
    Print #FileNo, mvarUserName
    Print #FileNo, mvarPassword
    Print #FileNo, mvarEmailAddress
End Sub

Public Sub LoadEntry(FileNo As Integer)
    Line Input #FileNo, mvarAccountName
    Line Input #FileNo, mvarUserName
    Line Input #FileNo, mvarPassword
    Line Input #FileNo, mvarEmailAddress
End Sub

Public Property Let EmailAddress(ByVal vData As String)
'used when assigning a value to the property, on the left side of an assignment.
'Syntax: X.EmailAddress = 5
    mvarEmailAddress = vData
End Property


Public Property Get EmailAddress() As String
'used when retrieving value of a property, on the right side of an assignment.
'Syntax: Debug.Print X.EmailAddress
    EmailAddress = mvarEmailAddress
End Property



Public Property Let Password(ByVal vData As String)
'used when assigning a value to the property, on the left side of an assignment.
'Syntax: X.Password = 5
    mvarPassword = vData
End Property


Public Property Get Password() As String
'used when retrieving value of a property, on the right side of an assignment.
'Syntax: Debug.Print X.Password
    Password = mvarPassword
End Property



Public Property Let UserName(ByVal vData As String)
'used when assigning a value to the property, on the left side of an assignment.
'Syntax: X.UserName = 5
    mvarUserName = vData
End Property


Public Property Get UserName() As String
'used when retrieving value of a property, on the right side of an assignment.
'Syntax: Debug.Print X.UserName
    UserName = mvarUserName
End Property



Public Property Let AccountName(ByVal vData As String)
'used when assigning a value to the property, on the left side of an assignment.
'Syntax: X.AccountName = 5
    mvarAccountName = vData
End Property


Public Property Get AccountName() As String
Attribute AccountName.VB_UserMemId = 0
'used when retrieving value of a property, on the right side of an assignment.
'Syntax: Debug.Print X.AccountName
    AccountName = mvarAccountName
End Property



Public Property Get Key() As String
    Key = mvarKey
End Property

Public Property Let Key(Value As String)
    If mvarKey <> "" Then
        Err.Raise 13, , "Key can be set only once."
    Else
        mvarKey = Value
    End If
End Property
