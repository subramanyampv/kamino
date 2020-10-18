VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "PictureItem"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Attribute VB_Ext_KEY = "SavedWithClassBuilder6" ,"Yes"
Attribute VB_Ext_KEY = "Top_Level" ,"Yes"
'local variable(s) to hold property value(s)
Private mFileName As String 'local copy
Private mTipText As String 'local copy
Private mPicture As StdPicture 'local copy
Private mTag As Variant 'local copy
Private mIndex As Integer 'local copy
Private mParent As PictureCollection 'local copy
Private mValid As Boolean

'Private Function PictureFromFile(sFile As String) As StdPicture
'    On Error GoTo ErrTrap
'    Dim kPicture As StdPicture
'    If FileLen(sFile) > 0 Then
'        mValid = True
'        Set kPicture = LoadPicture(sFile)
'    Else
'        mValid = False
'        Set kPicture = mParent.ErrorPicture
'    End If
'ExitSub:
'    Set PictureFromFile = kPicture
'    Set kPicture = Nothing
'    Exit Function
'ErrTrap:
'    If IsFileError(Err.Number) Or Err.Number = 481 Then
'        Set kPicture = mParent.ErrorPicture
'        mValid = False
'        Resume Next
'    Else
'        Set kPicture = Nothing
'        mValid = False
'        ShowErr
'        Resume ExitSub
'    End If
'End Function

Friend Sub SetMyParent(NewParent As PictureCollection)
    Set mParent = NewParent
End Sub

Friend Sub SetMyIndex(NewIndex As Integer)
    mIndex = NewIndex
End Sub

Public Property Set Parent(ByVal vData As PictureCollection)
Attribute Parent.VB_Description = "Returns the PictureCollection to which the item belongs."
    Err.Raise 387
End Property


Public Property Get Parent() As PictureCollection
    Set Parent = mParent
End Property



Public Property Let index(ByVal vData As Integer)
Attribute index.VB_Description = "The index of the item in the collection."
    Err.Raise 387
End Property


Public Property Get index() As Integer
    index = mIndex
End Property



Public Property Let Tag(ByVal vData As Variant)
Attribute Tag.VB_Description = "Placeholder for any custom application data."
    mTag = vData
End Property


Public Property Set Tag(ByVal vData As Variant)
    Set mTag = vData
End Property


Public Property Get Tag() As Variant
    If IsObject(mTag) Then
        Set Tag = mTag
    Else
        Tag = mTag
    End If
End Property



Public Property Set Picture(ByVal vData As StdPicture)
Attribute Picture.VB_Description = "Returns the picture of the item."
    Err.Raise 387
End Property


Public Property Get Picture() As StdPicture
    Set Picture = mParent.mParent.PictureFromFile(mFileName, mValid)
'    Dim k As StdPicture
'    If mParent.mParent.IsItemInCache(index) Then
'        Set k = mParent.mParent.GetPic(index)
'        mValid = (k <> mParent.ErrorPicture)
'        Set Picture = k
'        Set k = Nothing
'    Else
'        Set Picture = PictureFromFile(mFileName)
'        'Open "c:\temp1.txt" For Append As #1
'        'Print #1, mFileName
'        'Close #1
'    End If
End Property

Public Property Let TipText(ByVal vData As String)
Attribute TipText.VB_Description = "Returns/sets the text that will be displayed when hovering the mouse over the picture in a PhotoBrowser control."
    mTipText = vData
    If mIndex > 0 Then mParent.NotifyItemChanged Me
End Property

Public Property Get TipText() As String
    TipText = mTipText
End Property

Public Property Let Filename(ByVal vData As String)
Attribute Filename.VB_Description = "Returns/sets the filename of the picture. On set, it also loads the picture."
    mFileName = vData
    If mIndex > 0 Then mParent.NotifyItemChanged Me
End Property

Public Property Get Filename() As String
    Filename = mFileName
End Property

Public Function IsValid() As Boolean
    IsValid = mValid
End Function

Private Sub Class_Initialize()
    mIndex = 0
    Set mPicture = Nothing
End Sub

Private Sub Class_Terminate()
    Set mPicture = Nothing
End Sub
