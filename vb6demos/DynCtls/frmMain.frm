VERSION 5.00
Begin VB.Form Form1 
   Caption         =   "Dynamically adding controls"
   ClientHeight    =   3195
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   7230
   LinkTopic       =   "Form1"
   ScaleHeight     =   3195
   ScaleWidth      =   7230
   StartUpPosition =   3  'Windows Default
   Begin VB.CommandButton cmdLess 
      Caption         =   "<< &Less"
      Height          =   315
      Left            =   6000
      TabIndex        =   1
      Top             =   720
      Width           =   1095
   End
   Begin VB.PictureBox Picture1 
      Height          =   60
      Left            =   120
      ScaleHeight     =   0
      ScaleWidth      =   6915
      TabIndex        =   5
      TabStop         =   0   'False
      Top             =   480
      Width           =   6975
   End
   Begin VB.TextBox txtOption 
      Height          =   315
      Index           =   0
      Left            =   1200
      TabIndex        =   2
      Top             =   720
      Width           =   3495
   End
   Begin VB.CommandButton cmdMore 
      Caption         =   "&More >>"
      Default         =   -1  'True
      Height          =   315
      Left            =   4800
      TabIndex        =   0
      Top             =   720
      Width           =   1095
   End
   Begin VB.Label Label1 
      Caption         =   "Enter your keywords here. Press ""More"" to add more keywords or ""Less"" to remove a keyword"
      Height          =   255
      Left            =   120
      TabIndex        =   4
      Top             =   120
      Width           =   6855
   End
   Begin VB.Label lblOption 
      AutoSize        =   -1  'True
      Caption         =   "Keyword 1"
      Height          =   195
      Index           =   0
      Left            =   120
      TabIndex        =   3
      Top             =   720
      Width           =   750
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdLess_Click()
    Dim i As Integer
    If lblOption.Count = 1 Then
        MsgBox "You must type at least one keyword!", vbInformation, "Error"
    Else
        i = lblOption.Count - 1
        Unload lblOption(i)
        Unload txtOption(i)
        cmdMore.Top = lblOption(i - 1).Top
        cmdLess.Top = cmdMore.Top
    End If
End Sub

Private Sub cmdMore_Click()
    Dim i As Integer
    i = lblOption.Count
    Load lblOption(i)
    Load txtOption(i)
    lblOption(i).Move lblOption(i - 1).Left, lblOption(i - 1).Top + 350
    lblOption(i).Caption = "Keyword " & (i + 1)
    lblOption(i).Visible = True
    txtOption(i).Move txtOption(i - 1).Left, txtOption(i - 1).Top + 350
    txtOption(i).Text = ""
    txtOption(i).Visible = True
    txtOption(i).SetFocus
    cmdMore.Top = lblOption(i).Top
    cmdLess.Top = cmdMore.Top
End Sub
