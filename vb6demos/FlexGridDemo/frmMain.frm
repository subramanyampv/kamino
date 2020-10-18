VERSION 5.00
Object = "{5E9E78A0-531B-11CF-91F6-C2863C385E30}#1.0#0"; "MSFLXGRD.OCX"
Begin VB.Form Form1 
   Caption         =   "Size/Color Selector"
   ClientHeight    =   4875
   ClientLeft      =   60
   ClientTop       =   360
   ClientWidth     =   6885
   LinkTopic       =   "Form1"
   ScaleHeight     =   4875
   ScaleWidth      =   6885
   StartUpPosition =   3  'Windows Default
   Begin VB.CommandButton Command2 
      Caption         =   "Clear All"
      Height          =   495
      Left            =   1440
      TabIndex        =   2
      Top             =   3480
      Width           =   1215
   End
   Begin VB.CommandButton Command1 
      Caption         =   "Select All"
      Height          =   495
      Left            =   120
      TabIndex        =   1
      Top             =   3480
      Width           =   1215
   End
   Begin MSFlexGridLib.MSFlexGrid grid1 
      Height          =   3255
      Left            =   120
      TabIndex        =   0
      Top             =   120
      Width           =   6735
      _ExtentX        =   11880
      _ExtentY        =   5741
      _Version        =   393216
      RowHeightMin    =   128
      FormatString    =   ""
   End
   Begin VB.Image imgOn 
      Height          =   480
      Left            =   720
      Picture         =   "frmMain.frx":0000
      Top             =   4200
      Width           =   480
   End
   Begin VB.Image imgOff 
      Height          =   480
      Left            =   120
      Picture         =   "frmMain.frx":030A
      Top             =   4200
      Width           =   480
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False


Dim status() As Boolean

Private Sub Command1_Click()
    grid1.Redraw = False
    For i = 1 To grid1.Rows - 1
        For j = 1 To grid1.Cols - 1
            status(i, j) = True
            grid1.Col = j
            grid1.Row = i
            Set grid1.CellPicture = imgOn.Picture
        Next
    Next
    grid1.Redraw = True
End Sub

Private Sub Command2_Click()
    grid1.Redraw = False
    For i = 1 To grid1.Rows - 1
        For j = 1 To grid1.Cols - 1
            status(i, j) = False
            grid1.Col = j
            grid1.Row = i
            Set grid1.CellPicture = imgOff.Picture
        Next
    Next
    grid1.Redraw = True
End Sub

Private Sub Form_Load()
    
    grid1.Rows = 5
    grid1.Cols = 5
    
    ReDim status(4, 4)
    
    For i = 1 To grid1.Rows - 1
        grid1.RowHeight(i) = 34 * Screen.TwipsPerPixelY
        For j = 1 To grid1.Cols - 1
            grid1.Col = j
            grid1.Row = i
            Set grid1.CellPicture = imgOff.Picture
            grid1.CellPictureAlignment = flexAlignCenterCenter
            status(i, j) = False
        Next
    Next
End Sub

Private Sub grid1_Click()
    status(grid1.Row, grid1.Col) = Not status(grid1.Row, grid1.Col)
    If status(grid1.Row, grid1.Col) Then
        Set grid1.CellPicture = imgOn.Picture
    Else
        Set grid1.CellPicture = imgOff.Picture
    End If
End Sub

Private Sub grid1_KeyPress(KeyAscii As Integer)
    If KeyAscii = 32 Then
        grid1_Click
    End If
End Sub
