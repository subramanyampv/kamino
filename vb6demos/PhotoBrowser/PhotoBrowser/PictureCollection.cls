VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "PictureCollection"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Attribute VB_Description = "A collection of PictureItem classes."
Attribute VB_Ext_KEY = "SavedWithClassBuilder6" ,"Yes"
Attribute VB_Ext_KEY = "Collection" ,"PictureItem"
Attribute VB_Ext_KEY = "Member0" ,"PictureItem"
Attribute VB_Ext_KEY = "Top_Level" ,"Yes"
Option Explicit

'local variable to hold collection
Private mCol As Collection
Private mErrorPicture As StdPicture
'To fire this event, use RaiseEvent with the following syntax:
'RaiseEvent ItemChanged[(arg1, arg2, ... , argn)]
Public Event ItemChanged(ByVal Item As PictureItem)
Attribute ItemChanged.VB_Description = "Event that triggers when an item is changed."
Public mParent As PhotoBrowser

Public Sub Clear()
Attribute Clear.VB_Description = "Removes all items."
    Dim i As Integer
    For i = mCol.Count To 1 Step -1
        mCol.Remove i
    Next
End Sub

Friend Sub NotifyItemChanged(ByVal Item As PictureItem)
    RaiseEvent ItemChanged(Item)
End Sub


Public Function Add(FileName As String, TipText As String, Optional sKey As String) As PictureItem
Attribute Add.VB_Description = "Adds a new picture to the collection."
    'create a new object
    Dim objNewMember As PictureItem
    Set objNewMember = New PictureItem
    
    objNewMember.SetMyParent Me

    'set the properties passed into the method
    objNewMember.FileName = FileName
    objNewMember.TipText = TipText

    If Len(sKey) = 0 Then
        mCol.Add objNewMember
    Else
        mCol.Add objNewMember, sKey
    End If
    
    objNewMember.SetMyIndex mCol.Count


    'return the object created
    Set Add = objNewMember
    Set objNewMember = Nothing


End Function

Public Property Get Item(vntIndexKey As Variant) As PictureItem
Attribute Item.VB_UserMemId = 0
    'used when referencing an element in the collection
    'vntIndexKey contains either the Index or Key to the collection,
    'this is why it is declared as a Variant
    'Syntax: Set foo = x.Item(xyz) or Set foo = x.Item(5)
  Set Item = mCol(vntIndexKey)
End Property



Public Property Get Count() As Long
Attribute Count.VB_Description = "Returns the count of the items."
    'used when retrieving the number of elements in the
    'collection. Syntax: Debug.Print x.Count
    Count = mCol.Count
End Property


Public Sub Remove(vntIndexKey As Variant)
Attribute Remove.VB_Description = "Removes an item from the collection."
    'used when removing an element from the collection
    'vntIndexKey contains either the Index or Key, which is why
    'it is declared as a Variant
    'Syntax: x.Remove(xyz)
    Dim i As Integer, start As Integer
    start = Item(vntIndexKey).Index
    mCol.Remove vntIndexKey
    For i = start To mCol.Count
        Item(i).SetMyIndex i
    Next
End Sub


Public Property Get NewEnum() As IUnknown
Attribute NewEnum.VB_UserMemId = -4
Attribute NewEnum.VB_MemberFlags = "40"
    'this property allows you to enumerate
    'this collection with the For...Each syntax
    Set NewEnum = mCol.[_NewEnum]
End Property


Private Sub Class_Initialize()
    'creates the collection when this class is created
    Set mCol = New Collection
    Set mErrorPicture = Nothing
End Sub


Private Sub Class_Terminate()
    'destroys collection when this class is terminated
    Set mCol = Nothing
End Sub

Public Property Get ErrorPicture() As StdPicture
Attribute ErrorPicture.VB_Description = "Returns/sets the picture (type: StdPicture) that will be displayed when an invalid picture is added."
    Set ErrorPicture = mErrorPicture
End Property

Public Property Set ErrorPicture(Value As StdPicture)
    Set mErrorPicture = Value
End Property
