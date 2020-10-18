VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "MSWINSCK.OCX"
Begin VB.Form Form1
    Caption         =   "Chat Server"
    ClientHeight    =   3195
    ClientLeft      =   60
    ClientTop       =   345
    ClientWidth     =   4680
    LinkTopic       =   "Form1"
    ScaleHeight     =   3195
    ScaleWidth      =   4680
    StartUpPosition =   3  'Windows Default
    Begin VB.TextBox Text1
        Height          =   1695
        Left            =   120
        MultiLine       =   -1  'True
        ScrollBars      =   2  'Vertical
        TabIndex        =   0
        Top             =   1320
        Width           =   4455
    End
    Begin MSWinsockLib.Winsock wskPrimary
        Left            =   120
        Top             =   120
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        LocalPort       =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   1
        Left            =   600
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   2
        Left            =   1080
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   3
        Left            =   1560
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   4
        Left            =   2040
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   5
        Left            =   2520
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
    Begin MSWinsockLib.Winsock wskChild
        Index           =   0
        Left            =   120
        Top             =   600
        _ExtentX        =   741
        _ExtentY        =   741
        _Version        =   393216
        RemotePort      =   7000
    End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Implements ILogger


' holds 6 message buffers, needs to be aligned with wskChild component
Dim messageBuffers(5) As clsMessageBuffer
Dim handlers(5) As clsServerMessageHandler
Dim dispatcher As clsMessageDispatcher
Dim mUserList As clsUserList

' Creates a ISender that sends to only one client
Private Function CreateSingleSender(Index As Integer) As ISender
    Set CreateSingleSender = messageBuffers(Index)
End Function

' Creates an ISender that sends to all clients
Private Function CreateBroadcastSender() As ISender
    Dim Result As SenderCollection
    Set Result = New SenderCollection
    Dim i As Integer
    Dim x As ISender

    For i = LBound(messageBuffers) To UBound(messageBuffers)
        Set x = messageBuffers(i)
        Result.Add x
        Set x = Nothing
    Next

    Set CreateBroadcastSender = Result
    Set Result = Nothing
End Function

' Creates an ISender that sends to all clients except one
Private Function CreateBroadcastExceptOneSender(Index As Integer) As ISender
    Dim Result As SenderCollection
    Set Result = New SenderCollection
    Dim i As Integer
    Dim x As ISender

    For i = LBound(messageBuffers) To UBound(messageBuffers)
        If i <> Index Then
            Set x = messageBuffers(i)
            Result.Add x
            Set x = Nothing
        End If
    Next

    Set CreateBroadcastExceptOneSender = Result
    Set Result = Nothing
End Function

Private Sub Form_Load()
    Set dispatcher = New clsMessageDispatcher
    Set mUserList = New clsUserList

    ' associate message buffers with wskChild
    Dim i As Integer
    For i = wskChild.LBound To wskChild.UBound
        Set messageBuffers(i) = New clsMessageBuffer
        Set messageBuffers(i).Socket = wskChild(i)

        Set handlers(i) = New clsServerMessageHandler
        handlers(i).Index = i
        Set handlers(i).UserList = mUserList
        Set handlers(i).ReplyOne = CreateSingleSender(i)
        Set handlers(i).Logger = Me
    Next

    ' needs to be done after all message buffers are created
    For i = wskChild.LBound To wskChild.UBound
        Set handlers(i).ReplyOthers = CreateBroadcastExceptOneSender(i)
        Set handlers(i).ReplyAll = CreateBroadcastSender()
    Next

    ' listen for connections
    wskPrimary.Listen
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Dim i
    For i = wskChild.LBound To wskChild.UBound
        Set messageBuffers(i) = Nothing
        Set handlers(i) = Nothing
    Next

    Set dispatcher = Nothing
End Sub

Private Sub ILogger_Error(Message As String)
    Text1.SelText = "Error: " & Message & vbCrLf
End Sub

Private Sub ILogger_Info(Message As String)
    Text1.SelText = "Info: " & Message & vbCrLf
End Sub

Private Sub wskChild_Close(Index As Integer)
    handlers(Index).SendUserLeft
    mUserList.SetNickname Index, ""
End Sub

Private Sub wskChild_DataArrival(Index As Integer, ByVal bytesTotal As Long)
    Dim MessageBuffer As clsMessageBuffer
    Dim Message As String
    Set MessageBuffer = messageBuffers(Index)

    MessageBuffer.GetData bytesTotal
    While MessageBuffer.HasNext
        Message = MessageBuffer.GetNext()
        HandleSingleMessage Index, Message
    Wend

    Set MessageBuffer = Nothing
End Sub

Private Sub HandleSingleMessage(Index As Integer, Message As String)
    On Error GoTo Trap
    ILogger_Info "Received: " & Message
    dispatcher.Dispatch Message, handlers(Index)
    Exit Sub
Trap:
    handlers(Index).SendError Err.Number & "-" & Err.Description
End Sub

' Handle incoming connections
Private Sub wskPrimary_ConnectionRequest(ByVal requestID As Long)
    Dim i As Integer
    ILogger_Info "Connection Request"
    i = FindChildSocket
    If i = -1 Then
        ILogger_Error "No socket available"
    Else
        mUserList.SetNickname i, ""
        messageBuffers(i).Clear
        wskChild(i).Accept requestID
        ILogger_Info "Connection accepted at " & i
        handlers(i).SendWelcome
    End If
End Sub

' Find a child socket to accept an incoming request
Private Function FindChildSocket() As Integer
    Dim i As Integer ' commenting out
    Dim found As Boolean

    i = wskChild.LBound
    found = False

    While Not found And i <= wskChild.UBound
        CloseClosingSocket i
        If wskChild(i).State = sckClosed Then
            found = True
        Else
            i = i + 1
        End If
    Wend

    If Not found Then
        i = -1
    End If

    FindChildSocket = i
End Function

' Closes a socket if it's in closing state
Private Sub CloseClosingSocket(ByVal i As Integer)
    If wskChild(i).State = sckClosing Then
        wskChild(i).Close
    End If
End Sub
