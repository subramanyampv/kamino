Attribute VB_Name = "Olografoscode"
Option Explicit

Const Masculin = 0
Const Feminin = 1
Const Neutral = 2

Dim N1(1 To 3, 1 To 9) As String
Dim N2(1 To 4) As String
Dim N3(1 To 4) As String

Public Function OloTriada(s As String, Gender As Integer) As String
  Dim b As Integer
  Dim i As Integer
  Dim i2 As Integer
  Dim Result As String
  Dim h As String
  
  Result = ""
  For b = 1 To 3
    i = Asc(Mid(s, b, 1)) - 48
    'Αφαιρώ το 48 γιατί asc(0)=48
    If i <> 0 Then
      h = N1(4 - b, i)
      
      Select Case b
        Case 1
          If i <> 1 Then
            If Gender = Masculin Then
              h = h + "οι"
            ElseIf Gender = Feminin Then
              h = h + "ες"
            Else
              h = h + "α"
            End If
          End If
        Case 2
          If i = 1 Then
            i2 = Asc(Mid(s, 3, 1)) - 48
            If i2 = 1 Or i2 = 2 Then
              If i2 = 1 Then
                h = "έντεκα"
              ElseIf i2 = 2 Then
                h = "δώδεκα"
              End If
              Result = Result + h
              Exit For
            End If
          End If
        Case 3
          If i = 1 Then
            If Gender = Feminin Then
              h = "μία"
            End If
          ElseIf i = 3 Then
            If Gender = Neutral Then
              h = h + "ία"
            Else
              h = h + "εις"
            End If
          ElseIf i = 4 Then
            If Gender = Neutral Then
              h = h + "α"
            Else
              h = h + "ις"
            End If
          End If
      End Select
      
      Result = Result + h
      If b <> 3 Then Result = Result + " "
    End If
  Next b
  OloTriada = Result
End Function

Public Function Olografos(Num As Double, Gender As Integer) As String
  Dim iNum As Double
  Dim s As String
  Dim Result As String
  Dim h As String
  Dim b As Integer
  Dim Gen As Integer
  Dim triada As Integer
  Dim Decimicals As Boolean
    
  InitNames
  iNum = Int(Num)
  Decimicals = iNum <> Num
  If iNum = 0 Then
    Result = "μηδέν"
    GoTo GiveResult
  End If
  s = Trim(Str(iNum))
  If Len(s) Mod 3 <> 0 Then s = String(3 - (Len(s) Mod 3), "0") + s
  b = 0
  Result = ""
  While b < Len(s)
    triada = (Len(s) - b) \ 3
    ' η τριάδα μετριέται από δεξιά
    ' π.χ η τιμή 2 είναι η τριάδα των χιλιάδων
    If triada = 1 Then
      Gen = Gender
    ElseIf triada = 2 Then
      Gen = Feminin
    Else
      Gen = Neutral
    End If
    If triada = 2 And Val(Mid(s, b + 1, 3)) = 1 Then
      Result = Result + "χίλιες "
    Else
      Result = Result + OloTriada(Mid(s, b + 1, 3), Gen) + " "
      If triada <> 1 Then
        h = N2(triada - 1)
        If triada > 2 Then
          If Val(Mid(s, b + 1, 3)) = 1 Then
            h = h + "ο"
          Else
            h = h + "α"
          End If
        End If
        Result = Result + h + " "
      End If
    End If
    
    b = b + 3
  Wend
GiveResult:
  Mid(Result, 1, 1) = UCase(Mid(Result, 1, 1))
  Olografos = RTrim(Result)
End Function

Public Function OlografosΔρχ(Num As Double) As String
  OlografosΔρχ = Olografos(Num, Feminin) + " δρχ"
End Function
Public Sub InitNames()
  N1(1, 1) = "ένα"
  N1(1, 2) = "δύο"
  N1(1, 3) = "τρ"
  N1(1, 4) = "τέσσερ"
  N1(1, 5) = "πέντε"
  N1(1, 6) = "έξι"
  N1(1, 7) = "επτά"
  N1(1, 8) = "οχτώ"
  N1(1, 9) = "εννιά"
  N1(2, 1) = "δέκα"
  N1(2, 2) = "είκοσι"
  N1(2, 3) = "τριάντα"
  N1(2, 4) = "σαράντα"
  N1(2, 5) = "πενήντα"
  N1(2, 6) = "εξήντα"
  N1(2, 7) = "εβδομήντα"
  N1(2, 8) = "ογδόντα"
  N1(2, 9) = "ενενήντα"
  N1(3, 1) = "εκατό"
  N1(3, 2) = "διακόσι"
  N1(3, 3) = "τριακόσι"
  N1(3, 4) = "τετρακόσι"
  N1(3, 5) = "πεντακόσι"
  N1(3, 6) = "εξακόσι"
  N1(3, 7) = "επτακόσι"
  N1(3, 8) = "οχτακόσι"
  N1(3, 9) = "εννιακόσι"
  
  N2(1) = "χιλιάδες"
  N2(2) = "εκατομμύρι"
  N2(3) = "δισεκατομμύρι"
  N2(4) = "τρισεκατομμύρι"
  
  N3(1) = "δέκατα"
  N3(2) = "εκατοστά"
  N3(3) = "χιλιοστά"
  N3(4) = "δεκάκις χιλιοστά"
End Sub
