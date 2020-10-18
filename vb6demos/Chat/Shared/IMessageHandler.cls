VERSION 1.0 CLASS
BEGIN
    MultiUse = -1  'True
    Persistable = 0  'NotPersistable
    DataBindingBehavior = 0  'vbNone
    DataSourceBehavior  = 0  'vbNone
    MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "IMessageHandler"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit

Public Sub HandleTextMessage(Message As String)

End Sub

Public Sub HandleUserList(Users() As String)

End Sub

Public Sub NicknameRequested(Nickname As String)

End Sub

Public Sub NicknameApproved(Nickname As String)

End Sub

Public Sub UserJoined(Nickname As String)

End Sub

Public Sub UserRenamed(OldNickname As String, NewNickname As String)

End Sub

Public Sub UserLeft(Nickname As String)

End Sub

Public Sub HandleError(Message As String)

End Sub
