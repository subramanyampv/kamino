VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsMessageBuffer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit
Implements ISender
Private mBuffer As String
Private SEPARATOR As String

' Due to this property, this file cannot live in the Shared project.
' That's why it sits in the Common folder, shared by both Client and Server.
Private mSocket As Winsock

Public Property Get Socket() As Winsock
    Set Socket = mSocket
End Property

Public Property Set Socket(aSocket As Winsock)
    Set mSocket = aSocket
End Property

Public Sub GetData(bytesTotal As Long)
    Dim Msg As String
    Socket.GetData Msg, , bytesTotal
    mBuffer = mBuffer & Msg
    DoEvents
End Sub

Public Function HasNext() As Boolean
    HasNext = InStr(mBuffer, SEPARATOR) > 0
End Function

Public Function GetNext() As String
    Dim position As Integer
    position = InStr(mBuffer, SEPARATOR)
    GetNext = Left(mBuffer, position - 1)
    mBuffer = Mid(mBuffer, position + 1)
End Function

Public Sub Send(Message As String)
    If Socket.State = sckConnected Then
        Socket.SendData Message & SEPARATOR
    End If

    DoEvents
End Sub

' Clears the buffer
Public Sub Clear()
    mBuffer = ""
End Sub

Private Sub Class_Initialize()
    mBuffer = ""
    SEPARATOR = Chr(0)
End Sub

Private Sub ISender_Send(Message As String)
    Send Message
End Sub
