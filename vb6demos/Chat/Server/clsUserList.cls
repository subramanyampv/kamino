VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsUserList"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Private mNicknames(5) As String

Public Function GetNickname(Index As Integer) As String
    GetNickname = mNicknames(Index)
End Function

Public Sub SetNickname(Index As Integer, Nickname As String)
    mNicknames(Index) = Nickname
End Sub

Public Function UserExists(User As String) As Boolean
    Dim i As Integer

    UserExists = False

    For i = LBound(mNicknames) To UBound(mNicknames)
        If mNicknames(i) = User Then
            UserExists = True
            Exit For
        End If
    Next
End Function

Public Property Get Nicknames() As Collection
    Dim Result As Collection
    Set Result = New Collection
    
    Dim i As Integer
    For i = LBound(mNicknames) To UBound(mNicknames)
        If mNicknames(i) <> "" Then
            Result.Add mNicknames(i)
        End If
    Next
    
    Set Nicknames = Result
    Set Result = Nothing
End Property
