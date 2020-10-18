VERSION 5.00
Begin VB.Form frmOtherPwd 
   BorderStyle     =   3  'Fixed Dialog
   Caption         =   "New Password"
   ClientHeight    =   1530
   ClientLeft      =   1215
   ClientTop       =   2040
   ClientWidth     =   6030
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   1530
   ScaleWidth      =   6030
   ShowInTaskbar   =   0   'False
   Begin VB.TextBox txtPassword 
      Height          =   315
      Left            =   1440
      TabIndex        =   7
      Top             =   1080
      Width           =   3015
   End
   Begin VB.TextBox txtUserName 
      Height          =   315
      Left            =   1440
      TabIndex        =   5
      Top             =   600
      Width           =   3015
   End
   Begin VB.TextBox txtAccountName 
      Height          =   315
      Left            =   1440
      TabIndex        =   3
      Top             =   120
      Width           =   3015
   End
   Begin VB.CommandButton CancelButton 
      Cancel          =   -1  'True
      Caption         =   "Cancel"
      Height          =   375
      Left            =   4680
      TabIndex        =   1
      Top             =   600
      Width           =   1215
   End
   Begin VB.CommandButton OKButton 
      Caption         =   "OK"
      Default         =   -1  'True
      Height          =   375
      Left            =   4680
      TabIndex        =   0
      Top             =   120
      Width           =   1215
   End
   Begin VB.Label Label3 
      AutoSize        =   -1  'True
      Caption         =   "Password"
      Height          =   195
      Left            =   120
      TabIndex        =   6
      Top             =   1080
      Width           =   690
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      Caption         =   "Username"
      Height          =   195
      Left            =   120
      TabIndex        =   4
      Top             =   600
      Width           =   720
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      Caption         =   "Account name"
      Height          =   195
      Left            =   120
      TabIndex        =   2
      Top             =   120
      Width           =   1035
   End
End
Attribute VB_Name = "frmOtherPwd"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Public OK As Boolean

Private Sub CancelButton_Click()
    OK = False
    Hide
End Sub

Private Sub Form_Load()
    OK = False
End Sub

Private Sub OKButton_Click()
    OK = True
    Hide
End Sub

Public Sub WriteObject(o As Object)
    o.AccountName = txtAccountName.Text
    o.UserName = txtUserName.Text
    o.Password = txtPassword.Text
End Sub

Public Sub ReadObject(o As Object)
    txtAccountName.Text = o.AccountName
    txtUserName.Text = o.UserName
    txtPassword.Text = o.Password
End Sub
