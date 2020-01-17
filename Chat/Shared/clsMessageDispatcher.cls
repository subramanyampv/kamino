VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsMessageDispatcher"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit

Public Sub Dispatch(Message As String, Handler As IMessageHandler)
    If Left(Message, 1) = "/" Then
        DispatchCommandMessage Mid(Message, 2), Handler
    Else
        Handler.HandleTextMessage Message
    End If
End Sub

Private Function SubArray(arr() As String, Start As Integer) As String()
    Dim result() As String
    ReDim result(UBound(arr) - Start)
    Dim i
    For i = 0 To UBound(result)
        result(i) = arr(i + Start)
    Next
    
    SubArray = result
End Function

Private Sub DispatchCommandMessage(Msg As String, Handler As IMessageHandler)
    Dim arguments() As String
    arguments = Split(Msg, " ")
    Dim command As String
    command = arguments(0)
    arguments = SubArray(arguments, 1)
    
    Select Case command
        Case "users"
            Handler.HandleUserList arguments
        Case "nick"
            Handler.NicknameRequested arguments(0)
        Case "nickapproved"
            Handler.NicknameApproved arguments(0)
        Case "userjoined"
            Handler.UserJoined arguments(0)
        Case "userleft"
            Handler.UserLeft arguments(0)
        Case "userrenamed"
            Handler.UserRenamed arguments(0), arguments(1)
        Case "error"
            Handler.HandleError arguments(0)
        Case Else
            Err.Raise vbObjectError, "clsMessageDispatcher", "Unknown message type " & command
    End Select
End Sub
