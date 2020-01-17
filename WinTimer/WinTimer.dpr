program WinTimer;

uses
  Windows,
  Messages,
  ShellAPI,
  CommCtrl,
  WinTimerCtl,
  NGWindows in 'NGWindows.pas',
  ConfigureBox in 'ConfigureBox.pas',
  Grafix in 'Grafix.pas';

{$R WinTimer!.Res}

const
  MainWndClassName = 'WinTimerClass';
  WM_TRAYICON      = WM_USER + 2;
  ID_FirstIcon     = 1000;
  IDI_Main = 1;
  ID_ABOUT         = 102;
  ID_CONFIGURE     = 103;

  { Constants for the SetMenuDefaultItem function }
  SMDI_BYCOMMAND = 0;
  SMDI_BYPOS     = 1;

var
  MainWnd: HWND    = 0;

function GetMyMenu: HMENU;
begin
  Result:=GetSystemMenu(MainWnd, False);
end;

procedure MainWnd_Create(Wnd: HWND);
var
  t: TNotifyIconData;
  SysMenu: HMENU;
begin
  { Make sure MainWnd is equal to Wnd }
  MainWnd:=Wnd;

  { Create the taskbar icon }
  t.cbSize:=SizeOf(t);
  t.Wnd:=Wnd;
  t.uCallBackMessage:=WM_TRAYICON;
  t.uID:=ID_FirstIcon;
  t.uFlags:=NIF_ICON Or NIF_MESSAGE;
  t.hIcon:=LoadIcon(HInstance, PChar(1));
  Shell_NotifyIcon(NIM_ADD, @t);

  { Modify my system menu }
  SysMenu:=GetMyMenu;
  DeleteMenu(SysMenu, SC_SIZE, MF_BYCOMMAND);
  InsertMenu(SysMenu, 0, MF_BYPOSITION or MF_STRING, SC_RESTORE, '’νοιγμα');
  InsertMenu(SysMenu, 1, MF_BYPOSITION or MF_STRING, SC_MINIMIZE, 'Απόκρυψη');
  AppendMenu(SysMenu, MF_SEPARATOR, 0, nil);
  AppendMenu(SysMenu, 0, ID_ABOUT, 'Πληροφορίες...');
  AppendMenu(SysMenu, 0, ID_CONFIGURE, 'Ρυθμίσεις...');

  { Create the actual control }
  CreateWinTimerCtl(Wnd, -1, 8, 8);

  { Update my size }
  SetWindowPos(Wnd, 0, 0, 0,
    WinTimerWidth + 16 + 2 * GetSystemMetrics(SM_CXDLGFRAME),
    WinTimerHeight + 16 + GetSystemMetrics(SM_CYDLGFRAME)*2 + GetSystemMetrics(SM_CYSMSIZE),
    SWP_NOMOVE or SWP_NOZORDER or SWP_NOREDRAW or SWP_NOACTIVATE);
end;

procedure MainWnd_Restore;
var
  w: HWND;
begin
  ShowWindow(MainWnd, SW_RESTORE);
  w:=GetLastActivePopup(MainWnd);
  if IsWindow(w) then
    SetForegroundWindow(w)
  else
    SetForegroundWindow(MainWnd);
end;

procedure MainWnd_Minimize;
begin
  ShowWindow(MainWnd, SW_HIDE);
end;

procedure MainWnd_Destroy;
var
  t: TNotifyIconData;
begin
  t.cbSize:=SizeOf(t);
  t.Wnd:=MainWnd;
  t.uID:=ID_FirstIcon;
  Shell_NotifyIcon(NIM_DELETE, @t);
  PostQuitMessage(0);
end;

procedure MainWnd_TrayIcon(Wnd: HWND; wp: WPARAM; lp: LPARAM);
var
  P: TPoint;
begin
  If wp=ID_FirstIcon Then
  Case lp Of
    WM_LBUTTONUP:
      MainWnd_Restore;
    WM_RBUTTONUP:
      if IsWindowEnabled(Wnd) then
        begin
          GetCursorPos(p);
          TrackPopupMenu(GetMyMenu, TPM_RIGHTBUTTON, p.x, p.y, 0, Wnd, nil);
          PostMessage(Wnd, 0, 0, 0);
        end
      else
        MainWnd_Restore;
  end;
end;

procedure MainWnd_UpdateTip(Wnd: HWND; lp: LPARAM);
var
  t: TNotifyIconData;
begin
  t.cbSize:=SizeOf(t);
  t.Wnd:=Wnd;
  t.uID:=ID_FirstIcon;
  t.uFlags:=NIF_TIP;
  LStrCpy(t.szTip, PChar(lp));
  Shell_NotifyIcon(NIM_MODIFY, @t);
end;

procedure MainWnd_InitMenu(AMenu: HMENU);
begin
  if IsWindowVisible(MainWnd) then
    begin
      EnableMenuItem(AMenu, SC_RESTORE, MF_BYCOMMAND or MF_GRAYED);
      EnableMenuItem(AMenu, SC_MINIMIZE, MF_BYCOMMAND or MF_ENABLED);
      SetMenuDefaultItem(AMenu, SC_MINIMIZE, SMDI_ByCommand);
    end
  else
    begin
      EnableMenuItem(AMenu, SC_RESTORE, MF_BYCOMMAND or MF_ENABLED);
      EnableMenuItem(AMenu, SC_MINIMIZE, MF_BYCOMMAND or MF_GRAYED);
      EnableMenuItem(AMenu, SC_MOVE, MF_BYCOMMAND or MF_GRAYED);
      SetMenuDefaultItem(AMenu, SC_RESTORE, SMDI_ByCommand);
    end;
end;

function MainWndProc(Wnd: HWnd; Msg: UINT; wp: WPARAM; lp: LPARAM): LongInt; stdcall;
begin
  Result:=0;
  case Msg Of
    WM_CREATE    : MainWnd_Create(Wnd);
    WM_DESTROY   : MainWnd_Destroy;
    WM_TRAYICON  : MainWnd_TrayIcon(Wnd, wp, lp);
    WM_INITMENU, WM_INITMENUPOPUP  : MainWnd_InitMenu(LOWORD(wp));
    WM_SIZE:
      if wp = SIZE_MINIMIZED then
        MainWnd_Minimize;
    WM_COMMAND:
      Case LOWORD(Wp) Of
        SC_RESTORE:  MainWnd_Restore;
        SC_MINIMIZE: MainWnd_Minimize;
        ID_ABOUT:
          begin
            SetForegroundWindow(Wnd);
            DialogBox(HInstance, PChar(ID_ABOUT), Wnd, @SimpleDlgProc);
          end;
        ID_CONFIGURE:
          begin
            SetForeGroundWindow(Wnd);
            DialogBox(HInstance, PChar(ID_CONFIGURE), Wnd, @SimpleDlgProc);
          end;
        SC_CLOSE:     SendMessage(Wnd, WM_Close, 0, 0);
      End;
    WM_SYSCOMMAND:
      case wp of
        SC_RESTORE, SC_MINIMIZE, ID_ABOUT, ID_CONFIGURE, SC_CLOSE:
        begin
          Result:=1;
          SendMessage(Wnd, WM_COMMAND, wp, 0);
        end
      else
        Result:=DefWindowProc(Wnd, Msg, wp, lp);
      end;
    WTN_TIMER: MainWnd_UpdateTip(Wnd, lp);
  else
    Result:=DefWindowProc(Wnd, Msg, wp, lp);
  end;
end;

procedure GetMainWndClass(Var WndClass: TWndClass);
begin
  FillChar(WndClass, SizeOf(WndClass), #0);
  With WndClass Do Begin
    lpfnWndProc:= @MainWndProc;
    hInstance:= System.MainInstance;
    hIcon:= LoadIcon(HInstance, PChar(IDI_MAIN));
    hCursor:= LoadCursor(0, IDC_Arrow);
    hbrBackground:= COLOR_BTNFACE+1;
    lpszClassName:= MainWndClassName;
  End;
end;

procedure RegisterMainWnd;
Var
  MainWndClass: TWndClass;
begin
  If Not GetClassInfo(HInstance, MainWndClassName, MainWndClass) Then
    begin
      GetMainWndClass(MainWndClass);
      If RegisterClass(MainWndClass)=0 Then Halt(255);
    end;
end;


procedure MainLoop;
var
  Msg: TMsg;
begin
  while GetMessage(Msg, 0, 0, 0) Do begin
    TranslateMessage(Msg);
    DispatchMessage(Msg);
  end;
end;

begin
  RegisterMainWnd;
  MainWnd:=FindWindow(MainWndClassName, nil);
  if not IsWindow(MainWnd) then
    begin
      InitCommonControls;
      MainWnd:=CreateWindowEx(WS_EX_TOOLWINDOW,
               MainWndClassName, 'Ξυπνητήρι', WS_OVERLAPPEDWINDOW,
               CW_USEDEFAULT, CW_USEDEFAULT, 0, 0,
               0, 0, HInstance, nil);
      ShowWindow(MainWnd, CmdShow);
      MainLoop;
    end;
end.

