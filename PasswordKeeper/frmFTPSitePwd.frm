VERSION 5.00
Begin VB.Form frmFTPSitePwd 
   BorderStyle     =   3  'Fixed Dialog
   Caption         =   "New FTP Site Password"
   ClientHeight    =   3990
   ClientLeft      =   2760
   ClientTop       =   3750
   ClientWidth     =   6030
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   3990
   ScaleWidth      =   6030
   ShowInTaskbar   =   0   'False
   Begin VB.CheckBox chkWebSupport 
      Caption         =   "Web Support"
      Height          =   255
      Left            =   240
      TabIndex        =   10
      Top             =   2520
      Width           =   1335
   End
   Begin VB.Frame Frame1 
      Height          =   1335
      Left            =   120
      TabIndex        =   11
      Top             =   2520
      Width           =   4335
      Begin VB.TextBox txtWebDir 
         Height          =   315
         Left            =   1320
         TabIndex        =   15
         Text            =   "Text6"
         Top             =   840
         Width           =   2775
      End
      Begin VB.TextBox txtURL 
         Height          =   315
         Left            =   1320
         TabIndex        =   13
         Text            =   "Text6"
         Top             =   360
         Width           =   2775
      End
      Begin VB.Label Label7 
         AutoSize        =   -1  'True
         Caption         =   "WebDir"
         Height          =   195
         Left            =   240
         TabIndex        =   14
         Top             =   840
         Width           =   540
      End
      Begin VB.Label Label6 
         AutoSize        =   -1  'True
         Caption         =   "URL"
         Height          =   195
         Left            =   240
         TabIndex        =   12
         Top             =   360
         Width           =   330
      End
   End
   Begin VB.TextBox txtAvailSpace 
      Height          =   315
      Left            =   1440
      TabIndex        =   9
      Text            =   "Text5"
      Top             =   2040
      Width           =   3015
   End
   Begin VB.TextBox txtFTPHost 
      Height          =   315
      Left            =   1440
      TabIndex        =   7
      Text            =   "Text4"
      Top             =   1560
      Width           =   3015
   End
   Begin VB.TextBox txtPassword 
      Height          =   315
      Left            =   1440
      TabIndex        =   5
      Text            =   "Text3"
      Top             =   1080
      Width           =   3015
   End
   Begin VB.TextBox txtUserName 
      Height          =   315
      Left            =   1440
      TabIndex        =   3
      Text            =   "Text2"
      Top             =   600
      Width           =   3015
   End
   Begin VB.TextBox txtAccountName 
      Height          =   315
      Left            =   1440
      TabIndex        =   1
      Text            =   "Text1"
      Top             =   120
      Width           =   3015
   End
   Begin VB.CommandButton CancelButton 
      Cancel          =   -1  'True
      Caption         =   "Cancel"
      Height          =   375
      Left            =   4680
      TabIndex        =   17
      Top             =   600
      Width           =   1215
   End
   Begin VB.CommandButton OKButton 
      Caption         =   "OK"
      Default         =   -1  'True
      Height          =   375
      Left            =   4680
      TabIndex        =   16
      Top             =   120
      Width           =   1215
   End
   Begin VB.Label Label5 
      AutoSize        =   -1  'True
      Caption         =   "Disk Space"
      Height          =   195
      Left            =   120
      TabIndex        =   8
      Top             =   2040
      Width           =   825
   End
   Begin VB.Label Label4 
      AutoSize        =   -1  'True
      Caption         =   "FTP Host"
      Height          =   195
      Left            =   120
      TabIndex        =   6
      Top             =   1560
      Width           =   675
   End
   Begin VB.Label Label3 
      AutoSize        =   -1  'True
      Caption         =   "Password"
      Height          =   195
      Left            =   120
      TabIndex        =   4
      Top             =   1080
      Width           =   690
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      Caption         =   "Username"
      Height          =   195
      Left            =   120
      TabIndex        =   2
      Top             =   600
      Width           =   720
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      Caption         =   "Account name"
      Height          =   195
      Left            =   120
      TabIndex        =   0
      Top             =   120
      Width           =   1035
   End
End
Attribute VB_Name = "frmFTPSitePwd"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Public OK As Boolean

Private Sub OKButton_Click()
    OK = True
    Hide
End Sub

Private Sub CancelButton_Click()
    OK = False
    Hide
End Sub

Private Sub Form_Load()
    OK = False
End Sub

Public Sub ReadObject(o As Object)
    txtAccountName.Text = o.AccountName
    txtFTPHost.Text = o.FTPHost
    txtPassword.Text = o.Password
    txtURL.Text = o.URL
    txtUserName.Text = o.UserName
    txtWebDir.Text = o.WebDir
    txtAvailSpace.Text = o.AvailSpace
    chkWebSupport.Value = IIf(o.WebSupport, vbChecked, vbUnchecked)
End Sub

Public Sub WriteObject(o As Object)
    o.AccountName = txtAccountName.Text
    o.FTPHost = txtFTPHost.Text
    o.Password = txtPassword.Text
    o.URL = txtURL.Text
    o.UserName = txtUserName.Text
    o.WebDir = txtWebDir.Text
    o.AvailSpace = txtAvailSpace.Text
    o.WebSupport = chkWebSupport.Value = vbChecked
End Sub
