VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsServerMessageHandler"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit
Implements IMessageHandler

Private mUserList As clsUserList

' Holds the value of property Index
Private mIndex As Integer

' Holds the value of property ReplyOne
Private mReplyOne As ISender

' Holds the value of property ReplyAll
Private mReplyAll As ISender

' Holds the value of property ReplyOthers
Private mReplyOthers As ISender

Private mServerSender As clsServerSender

' Holds the value of property Logger
Private mLogger As ILogger

' Gets the value of property Logger
Public Property Get Logger() As ILogger
    Set Logger = mLogger
End Property

' Sets the value of property Logger
Public Property Set Logger(NewLogger As ILogger)
    Set mLogger = NewLogger
End Property

Public Property Get UserList() As clsUserList
    Set UserList = mUserList
End Property

Public Property Set UserList(NewUserList As clsUserList)
    Set mUserList = NewUserList
End Property

' Gets the value of property Index
Public Property Get Index() As Integer
    Index = mIndex
End Property

' Sets the value of property Index
Public Property Let Index(NewIndex As Integer)
    mIndex = NewIndex
End Property

' Gets the value of property ReplyOne
Public Property Get ReplyOne() As ISender
    Set ReplyOne = mReplyOne
End Property

' Sets the value of property ReplyOne
Public Property Set ReplyOne(NewReplyOne As ISender)
    Set mReplyOne = NewReplyOne
End Property

' Gets the value of property ReplyAll
Public Property Get ReplyAll() As ISender
    Set ReplyAll = mReplyAll
End Property

' Sets the value of property ReplyAll
Public Property Set ReplyAll(NewReplyAll As ISender)
    Set mReplyAll = NewReplyAll
End Property

' Gets the value of property ReplyOthers
Public Property Get ReplyOthers() As ISender
    Set ReplyOthers = mReplyOthers
End Property

' Sets the value of property ReplyOthers
Public Property Set ReplyOthers(NewReplyOthers As ISender)
    Set mReplyOthers = NewReplyOthers
End Property

Private Sub Class_Initialize()
    Set mServerSender = New clsServerSender
End Sub

Private Sub Class_Terminate()
    Set mServerSender = Nothing
End Sub

Public Sub SendWelcome()
    SendUserList
    mServerSender.SendTextMessage "Welcome! Please select a nickname with the /nick command.", ReplyOne
End Sub

Private Sub SendUserList()
    Dim Nicknames As Collection
    Dim NicknamesArray() As String
    Dim Nickname As String
    Dim i As Integer

    Set Nicknames = mUserList.Nicknames()
    If Nicknames.Count > 0 Then
        ReDim NicknamesArray(Nicknames.Count - 1)
        For i = 1 To Nicknames.Count
            NicknamesArray(i - 1) = Nicknames.Item(i)
        Next

        mServerSender.SendUserList NicknamesArray, ReplyOne
    End If

    Set Nicknames = Nothing
End Sub

Public Sub SendUserLeft()
    mServerSender.SendUserLeft mUserList.GetNickname(Index), ReplyAll
End Sub

Public Sub SendError(Message As String)
    mServerSender.SendError Message, ReplyOne
End Sub

Private Sub IMessageHandler_HandleError(Message As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_HandleTextMessage(Message As String)
    Dim Nickname As String
    Nickname = UserList.GetNickname(Index)
    If Nickname <> "" Then
        mServerSender.SendTextMessage "<" & Nickname & "> " & Message, ReplyAll
    Else
        mServerSender.SendError "no-nickname", ReplyOne
    End If
End Sub

Private Sub IMessageHandler_HandleUserList(Users() As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_NicknameApproved(Nickname As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_NicknameRequested(NewNickname As String)
    Dim IsExistingUser As Boolean
    Dim OldNickname As String

    OldNickname = UserList.GetNickname(Index)
    IsExistingUser = OldNickname <> ""

    If NewNickname <> "" Then
        If OldNickname <> NewNickname And UserList.UserExists(NewNickname) Then
            mServerSender.SendError "duplicate-nickname", ReplyOne
        Else
            UserList.SetNickname Index, NewNickname
            mServerSender.SendUserNicknameApproved NewNickname, ReplyOne

            If IsExistingUser Then
                mServerSender.SendUserRenamed OldNickname, NewNickname, ReplyOthers
            Else
                mServerSender.SendUserJoined NewNickname, ReplyOthers
            End If
        End If
    Else
        mServerSender.SendError "invalid-nickname", ReplyOne
    End If
End Sub

Private Sub IMessageHandler_UserJoined(Nickname As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_UserLeft(Nickname As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_UserRenamed(OldNickname As String, NewNickname As String)
    mLogger.Error "Unexpected message"
End Sub
