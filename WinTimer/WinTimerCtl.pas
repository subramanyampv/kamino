Unit WinTimerCtl;

interface

Uses Windows, Messages, Grafix;

const
  WinTimerControlClassName = 'WinTimerCtl';
  propImage = 'Image';
  ID_Timer = 1;
  WTN_Timer = WM_User + 1;
  DigitWidth = 28;
  DigitHeight = 50;
  DigitCount = 8;
  WinTimerWidth = DigitCount*DigitWidth + 5;
  WinTimerHeight = DigitHeight + 5;


procedure GetWinTimerControlClass(Var WndClass: TWndClass);
procedure RegisterWinTimerControl;
function WinTimerControlProc(Wnd: HWnd; Msg: UINT; wp: WPARAM; lp: LPARAM): LRESULT; stdcall;
procedure GetTimerText(Wnd: HWND; Buf: PChar);
function CreateWinTimerCtl(AParent: HWND; AnID, ALeft, ATop: Integer): HWND;

implementation

const
  ResName = 'DIGDISP';

function CreateWinTimerCtl(AParent: HWND; AnID, ALeft, ATop: Integer): HWND;
begin
  Result:=CreateWindowEx(WS_EX_STATICEDGE, WinTimerControlClassName,
     '', WS_CHILD or WS_VISIBLE,
     ALeft, ATop, WinTimerWidth, WinTimerHeight,
     AParent, AnID, HInstance, nil);
end;

procedure GetTimerText(Wnd: HWND; Buf: PChar);
begin
  GetWindowText(Wnd, Buf, DigitCount + 1);
end;

procedure WinTimerControl_Timer(Wnd: HWND); forward;

procedure WinTimerControl_Create(Wnd: HWND);
var
  Pic: HBitmap;
begin
  Pic:=LoadBitmap(HInstance, ResName);
  SetProp(Wnd, propImage, Pic);
  WinTimerControl_Timer(Wnd);
  SetTimer(Wnd, ID_Timer, 1000, nil);
end;

procedure WinTimerControl_Paint(Wnd: HWND);
var
  PS: TPaintStruct;
  Buf: array [0..DigitCount] of Char;
  b: Integer;
  Pic: HBitmap;

begin
  BeginPaint(Wnd, PS);

  GetTimerText(Wnd, Buf);
  Pic:=GetProp(Wnd, propImage);

  For b:=0 to DigitCount - 1 Do
    DrawPartOfBitmap(PS.hDC, Pic, (Ord(Buf[b])-48)*28, 0, 28, 50, b*28 + 2, 2, 0, 0, False);

  EndPaint(Wnd, PS);
end;

function IntToMyStr(Num: Integer): String;
begin
  Str(Num, Result);
  If Num<10 Then Result:='0'+Result;
end;

procedure WinTimerControl_Timer(Wnd: HWND);
var
  TimeElapsed: LongInt;
  Hour, Min, Sec: Integer;
  Buf: array [0..8] of Char;
begin
  TimeElapsed:=GetTickCount Div 1000;
  Hour:=TimeElapsed Div 3600;
  TimeElapsed:=TimeElapsed - Hour*3600;
  Min:=TimeElapsed Div 60;
  TimeElapsed:=TimeElapsed - Min*60;
  Sec:=TimeElapsed;
  LStrCpy(Buf, PChar(IntToMyStr(Hour)+':'+IntToMyStr(Min)+':'+IntToMyStr(Sec)));
  SetWindowText(Wnd, Buf);
  InvalidateRect(Wnd, nil, False);
  SendMessage(GetParent(Wnd), WTN_Timer, 0, LongInt(@Buf));
end;

procedure WinTimerControl_Destroy(Wnd: HWND);
begin
  DeleteObject(GetProp(Wnd, propImage));
  RemoveProp(Wnd, propImage);
  KillTimer(Wnd, ID_Timer);
end;

function WinTimerControlProc(Wnd: HWnd; Msg: UINT; wp: WPARAM; lp: LPARAM): LRESULT;
begin
  Result:=0;
  case Msg Of
    WM_Create:    WinTimerControl_Create(Wnd);
    WM_Paint:     WinTimerControl_Paint(Wnd);
    WM_Timer:     WinTimerControl_Timer(Wnd);
    WM_NCDestroy: WinTimerControl_Destroy(Wnd);
    WM_GetDlgCode: Result:=DLGC_STATIC;
    else
      Result:=DefWindowProc(Wnd,Msg,wp,lp);
  End;
end;

procedure GetWinTimerControlClass(Var WndClass: TWndClass);
begin
  With WndClass Do Begin
    style:= 0;
    lpfnWndProc:= @WinTimerControlProc;
    cbClsExtra:= 0;
    cbWndExtra:= 0;
    hInstance:= System.MainInstance;
    hIcon:= 0;
    hCursor:= LoadCursor(0, IDC_Arrow);
    hbrBackground:= GetStockObject(BLACK_BRUSH);
    lpszMenuName:= nil;
    lpszClassName:= WinTimerControlClassName;
  End;
end;

procedure RegisterWinTimerControl;
Var
  WinTimerControlClass: TWndClass;
begin
  If Not GetClassInfo(HInstance, WinTimerControlClassName, WinTimerControlClass) Then
    begin
      GetWinTimerControlClass(WinTimerControlClass);
      If RegisterClass(WinTimerControlClass)=0 Then Halt(255);
    end;
end;

initialization
  RegisterWinTimerControl;
end.