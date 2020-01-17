VERSION 5.00
Object = "{3B7C8863-D78F-101B-B9B5-04021C009402}#1.2#0"; "RICHTX32.OCX"
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "MSWINSCK.OCX"
Begin VB.Form Form1
   Caption         =   "Chat Client"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   7755
   LinkTopic       =   "Form1"
   ScaleHeight     =   3195
   ScaleWidth      =   7755
   StartUpPosition =   3  'Windows Default
   Begin MSWinsockLib.Winsock Winsock1
      Left            =   5040
      Top             =   360
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
      RemotePort      =   7000
   End
   Begin VB.ListBox lstUsers
      BeginProperty Font
         Name            =   "Fixedsys"
         Size            =   9
         Charset         =   161
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   300
      IntegralHeight  =   0   'False
      Left            =   5040
      TabIndex        =   2
      Top             =   0
      Width           =   1215
   End
   Begin VB.TextBox txtIn
      BeginProperty Font
         Name            =   "Fixedsys"
         Size            =   9
         Charset         =   161
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   0
      TabIndex        =   1
      Text            =   "Type your message here"
      Top             =   1920
      Width           =   1215
   End
   Begin RichTextLib.RichTextBox richOut
      Height          =   1935
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   4695
      _ExtentX        =   8281
      _ExtentY        =   3413
      _Version        =   393217
      Enabled         =   -1  'True
      ReadOnly        =   -1  'True
      ScrollBars      =   2
      TextRTF         =   $"ChatForm.frx":0000
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "Fixedsys"
         Size            =   9
         Charset         =   161
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Implements IMessageHandler

Dim mNickname As String
Dim messageBuffer As clsMessageBuffer
Dim dispatcher As clsMessageDispatcher
Dim mLoggerImpl As clsLogger
Dim mLogger As ILogger

Private Sub Form_Load()
    Set mLoggerImpl = New clsLogger
    Set mLoggerImpl.RichText = richOut
    Set mLogger = mLoggerImpl

    Set dispatcher = New clsMessageDispatcher
    Set messageBuffer = New clsMessageBuffer
    Set messageBuffer.Socket = Winsock1

    mLogger.Info "Connecting"
    Winsock1.Connect "127.0.0.1"
End Sub

Private Sub Form_Resize()
    On Error Resume Next
    richOut.Move 0, 0, ScaleWidth * 0.8, ScaleHeight - txtIn.Height
    txtIn.Move 0, ScaleHeight - txtIn.Height, ScaleWidth
    lstUsers.Move richOut.Width, 0, ScaleWidth - richOut.Width, richOut.Height
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Winsock1.Close
    Do While Winsock1.State <> 0
        DoEvents
    Loop
    Set messageBuffer = Nothing
    Set dispatcher = Nothing
    Set mLogger = Nothing
End Sub

Private Sub IMessageHandler_HandleError(Message As String)
    mLogger.Error Message
End Sub

Private Sub IMessageHandler_HandleTextMessage(Message As String)
    mLogger.Info Message
End Sub

Private Sub IMessageHandler_HandleUserList(Users() As String)
    Dim i As Integer
    mLogger.Info "User list received"
    For i = LBound(Users) To UBound(Users)
        lstUsers.AddItem Users(i)
    Next
End Sub

Private Sub IMessageHandler_NicknameApproved(NewNickname As String)
    Nickname = NewNickname
End Sub

Private Sub IMessageHandler_NicknameRequested(Nickname As String)
    mLogger.Error "Unexpected message"
End Sub

Private Sub IMessageHandler_UserJoined(Nickname As String)
    mLogger.Info "User joined: " & Nickname
    lstUsers.AddItem Nickname
End Sub

Private Sub IMessageHandler_UserLeft(Nickname As String)
    Dim i As Integer
    mLogger.Info "User left: " & Nickname
    For i = 0 To lstUsers.ListCount - 1
        If lstUsers.List(i) = Nickname Then
            lstUsers.RemoveItem i
            Exit For
        End If
    Next
End Sub

Private Sub IMessageHandler_UserRenamed(OldNickname As String, NewNickname As String)
    Dim i As Integer
    mLogger.Info "User renamed: " & OldNickname & " -> " & NewNickname
    For i = 0 To lstUsers.ListCount - 1
        If lstUsers.List(i) = OldNickname Then
            lstUsers.List(i) = NewNickname
            Exit For
        End If
    Next
End Sub

Private Sub txtIn_KeyPress(KeyAscii As Integer)
    Dim s As String
    If Winsock1.State <> sckConnected Then Exit Sub

    If KeyAscii = 13 And txtIn.Text <> "" Then
        KeyAscii = 0 ' prevent beep
        SendMessage txtIn.Text
        txtIn.Text = ""
    End If
End Sub

Private Sub Winsock1_Connect()
    mLogger.Info "Connected"
    ChangeNickname
End Sub

Private Sub Winsock1_DataArrival(ByVal bytesTotal As Long)
    Dim Message As String
    messageBuffer.GetData bytesTotal
    While messageBuffer.HasNext
        Message = messageBuffer.GetNext()
        HandleSingleMessage Message
    Wend
End Sub

Private Sub HandleSingleMessage(Message As String)
    On Error GoTo Trap
    mLogger.Info "Received: " & Message
    dispatcher.Dispatch Message, Me
    Exit Sub
Trap:
    mLogger.Error Err.Number & " - " & Err.Description
End Sub

Private Sub ChangeNickname()
    SendMessage "/nick " & Trim(InputBox("Enter User Name: "))
End Sub

Private Property Get Nickname() As String
    Nickname = mNickname
End Property

Private Property Let Nickname(value As String)
    Dim i As Integer
    Dim OldNickname As String
    Dim found As Boolean
    found = False
    OldNickname = mNickname
    mNickname = value
    Caption = "Chat Client - " & mNickname
    For i = 0 To lstUsers.ListCount - 1
        If lstUsers.List(i) = OldNickname Then
            lstUsers.List(i) = mNickname
            found = True
            Exit For
        End If
    Next

    If Not found Then
        lstUsers.AddItem mNickname
    End If
End Property

Private Sub SendMessage(Message As String)
    messageBuffer.Send Message
End Sub
