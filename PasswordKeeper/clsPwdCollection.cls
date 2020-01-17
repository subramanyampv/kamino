VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "clsPwdCollection"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Attribute VB_Ext_KEY = "SavedWithClassBuilder6" ,"Yes"
Attribute VB_Ext_KEY = "Top_Level" ,"Yes"
Option Explicit

Private mCol As Collection

Private Sub Class_Initialize()
    Set mCol = New Collection
End Sub

Private Sub Class_Terminate()
    Clear
    Set mCol = Nothing
End Sub

Public Sub Clear()
    Dim o As Object
    Do While mCol.Count > 0
        Set o = mCol(mCol.Count)
        mCol.Remove mCol.Count
        Set o = Nothing
    Loop
End Sub

Public Sub Load(FileName As String)
    Dim FileNo As Integer, iCount As Integer, i As Integer
    Dim sCount As String
    Dim sEntryType As String, iEntryType As Integer
    Dim obj As Object
    
    Clear
    FileNo = FreeFile
    Open FileName For Input As #FileNo
    Line Input #FileNo, sCount
    iCount = Int(Val(sCount))
    For i = 1 To iCount
        Line Input #FileNo, sEntryType
        iEntryType = Int(Val(sEntryType))
        Set obj = EntryTypeToObject(iEntryType)
        If Not obj Is Nothing Then
            obj.LoadEntry FileNo
            Add obj
            Set obj = Nothing
        End If
    Next
    Close #FileNo
End Sub

Public Sub Save(FileName As String)
    Dim FileNo As Integer
    Dim o As Object
    FileNo = FreeFile
    Open FileName For Output As #FileNo
    Print #FileNo, Str(mCol.Count)
    For Each o In mCol
        Print #FileNo, Str(o.EntryType)
        o.SaveEntry FileNo
    Next
    Close #FileNo
End Sub

Public Sub Add(obj As Object)
    Dim sKey As String
    sKey = "S" + CStr(mCol.Count)
    obj.Key = sKey
    mCol.Add obj, sKey
End Sub

Public Property Get Items() As Collection
    Set Items = mCol
End Property

Public Property Get Count() As Long
    Count = mCol.Count
End Property

