VERSION 5.00
Begin VB.Form Form1 
   Caption         =   "Ολογράφως"
   ClientHeight    =   1365
   ClientLeft      =   1695
   ClientTop       =   1740
   ClientWidth     =   4740
   LinkTopic       =   "Form1"
   ScaleHeight     =   1365
   ScaleWidth      =   4740
   Begin VB.TextBox Source 
      Height          =   315
      Left            =   1320
      TabIndex        =   1
      Top             =   120
      Width           =   1815
   End
   Begin VB.Label Result 
      Height          =   615
      Left            =   1320
      TabIndex        =   3
      Top             =   600
      Width           =   3255
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      Caption         =   "Ολογράφως"
      Height          =   255
      Left            =   120
      TabIndex        =   2
      Top             =   600
      Width           =   975
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      Caption         =   "Κόστος"
      Height          =   255
      Left            =   120
      TabIndex        =   0
      Top             =   120
      Width           =   615
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub Source_Change()
Result.Caption = OlografosΔρχ(Val(Source.Text))
End Sub
