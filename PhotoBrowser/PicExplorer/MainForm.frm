VERSION 5.00
Object = "*\A..\PhotoBrowser\PhotoBrowserCtl.vbp"
Begin VB.Form PictureExplorer 
   Caption         =   "Picture Explorer"
   ClientHeight    =   4665
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5250
   LinkTopic       =   "Form1"
   ScaleHeight     =   4665
   ScaleWidth      =   5250
   StartUpPosition =   3  'Windows Default
   Begin PhotoBrowserCtl.PhotoBrowser PhotoBrowser1 
      Height          =   4455
      Left            =   1920
      TabIndex        =   4
      Top             =   120
      Width           =   3255
      _ExtentX        =   5741
      _ExtentY        =   7858
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   161
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ScaleHeight     =   4455
      ScaleMode       =   0
      ScaleWidth      =   3255
   End
   Begin VB.PictureBox Picture1 
      Align           =   3  'Align Left
      BorderStyle     =   0  'None
      Height          =   4665
      Left            =   0
      ScaleHeight     =   4665
      ScaleWidth      =   1920
      TabIndex        =   0
      Top             =   0
      Width           =   1920
      Begin VB.FileListBox File1 
         BeginProperty Font 
            Name            =   "Tahoma"
            Size            =   8.25
            Charset         =   161
            Weight          =   400
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         Height          =   2625
         Left            =   0
         TabIndex        =   3
         Top             =   1920
         Width           =   1815
      End
      Begin VB.DirListBox Dir1 
         BeginProperty Font 
            Name            =   "Tahoma"
            Size            =   8.25
            Charset         =   161
            Weight          =   400
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         Height          =   1440
         Left            =   0
         TabIndex        =   2
         Top             =   480
         Width           =   1815
      End
      Begin VB.DriveListBox Drive1 
         BeginProperty Font 
            Name            =   "Tahoma"
            Size            =   8.25
            Charset         =   161
            Weight          =   400
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         Height          =   315
         Left            =   0
         TabIndex        =   1
         Top             =   120
         Width           =   1815
      End
   End
End
Attribute VB_Name = "PictureExplorer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdBrowse_Click()

End Sub

Private Sub Text1_Change()

End Sub

Private Sub Dir1_Change()
    Dim i As Integer
    File1.Path = Dir1.Path
    PhotoBrowser1.ClearPhotos
    For i = 0 To File1.ListCount - 1
        PhotoBrowser1.AddPhoto Dir1.Path & "\" & File1.List(i), File1.List(i)
    Next
End Sub

Private Sub Drive1_Change()
    Dir1.Path = Drive1.Drive
End Sub

Private Sub Form_Resize()
    PhotoBrowser1.Move Picture1.Width, 0, ScaleWidth - Picture1.Width, ScaleHeight
End Sub
