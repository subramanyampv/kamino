VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsLogger"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
' Implements logger backed by a rich text control

Option Explicit
Implements ILogger

Private mRichText As RichTextBox

Public Property Get RichText() As RichTextBox
    Set RichText = mRichText
End Property

Public Property Set RichText(Box As RichTextBox)
    Set mRichText = Box
End Property

Private Sub AddText(Msg As String)
    Dim i As Long
    i = Len(mRichText.Text)
    mRichText.SelStart = i
    mRichText.SelText = Msg
    mRichText.SelStart = i
    mRichText.SelLength = Len(mRichText.Text) - i
End Sub

Private Sub ShowMessage(Msg As String)
    AddText Msg & vbCrLf
    mRichText.SelStart = mRichText.SelStart + mRichText.SelLength
End Sub

Private Sub ShowInformation(Msg As String)
    AddText Msg & vbCrLf
    mRichText.SelColor = RGB(0, 128, 0)
    mRichText.SelStart = mRichText.SelStart + mRichText.SelLength
    mRichText.SelColor = RGB(0, 0, 0)
End Sub

Private Sub ShowError(Msg As String)
    AddText Msg & vbCrLf
    mRichText.SelColor = RGB(128, 0, 0)
    mRichText.SelStart = mRichText.SelStart + mRichText.SelLength
    mRichText.SelColor = RGB(0, 0, 0)
End Sub

Private Sub ILogger_Error(Message As String)
    ShowError Message
End Sub

Private Sub ILogger_Info(Message As String)
    ShowInformation Message
End Sub
