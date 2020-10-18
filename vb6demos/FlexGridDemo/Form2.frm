VERSION 5.00
Object = "{5E9E78A0-531B-11CF-91F6-C2863C385E30}#1.0#0"; "MSFLXGRD.OCX"
Begin VB.Form Form2 
   Caption         =   "Order Maker (Size/Color)"
   ClientHeight    =   3300
   ClientLeft      =   60
   ClientTop       =   360
   ClientWidth     =   7695
   LinkTopic       =   "Form2"
   ScaleHeight     =   3300
   ScaleWidth      =   7695
   StartUpPosition =   3  'Windows Default
   Begin MSFlexGridLib.MSFlexGrid grid1 
      Height          =   3015
      Left            =   120
      TabIndex        =   0
      Top             =   120
      Width           =   7455
      _ExtentX        =   13150
      _ExtentY        =   5318
      _Version        =   393216
   End
End
Attribute VB_Name = "Form2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim Avail() As Boolean
Private Sub Form_Load()
    grid1.Rows = 5: grid1.Cols = 5
    ReDim Avail(4, 4)
    
End Sub

