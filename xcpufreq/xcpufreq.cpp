/***************************************************************************
 *   Copyright (C) 2004 by Nikolaos Georgiou                               *
 *   ngeor@laptopaki                                                       *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.             *
 ***************************************************************************/
#include "wx/wxprec.h"

#ifndef WX_PRECOMP
#include "wx/wx.h"
#endif
#include "xcpufreq.h"

wxBEGIN_EVENT_TABLE(xcpufreqFrame, wxFrame)
	EVT_MENU(Menu_File_Quit, xcpufreqFrame::OnQuit)
	EVT_MENU(Menu_File_About, xcpufreqFrame::OnAbout)
	EVT_TIMER(TIMER_ID, xcpufreqFrame::OnTimer)
wxEND_EVENT_TABLE()

wxIMPLEMENT_APP(xcpufreqapp);

bool xcpufreqapp::OnInit()
{
	xcpufreqFrame *frame = new xcpufreqFrame(
		"Hello World",
		wxPoint(50, 50),
		wxSize(480, 50));

	frame->Show(TRUE);
	SetTopWindow(frame);
	return TRUE;
}

xcpufreqFrame::xcpufreqFrame(const wxString &title, const wxPoint &pos, const wxSize &size)
	: wxFrame((wxFrame *)NULL, -1, title, pos, size),
	  timer(this, TIMER_ID),
	  cpuLabel(this, -1, wxT("CPU Information"), wxPoint(0, 0), wxSize(400, 20))
{
	/*	wxMenu *menuFile = new wxMenu;

	menuFile->Append( Menu_File_About, wxT( "&About..." ) );
	menuFile->AppendSeparator();
	menuFile->Append( Menu_File_Quit, wxT( "E&xit" ) );

	wxMenuBar *menuBar = new wxMenuBar;
	menuBar->Append( menuFile, wxT( "&File" ) );

	SetMenuBar( menuBar );



*/
	timer.Start(1000);
}

void xcpufreqFrame::OnQuit(wxCommandEvent &WXUNUSED(event))
{
	Close(TRUE);
}

void xcpufreqFrame::OnAbout(wxCommandEvent &WXUNUSED(event))
{
	wxMessageBox(wxT("This is a wxWindows Hello world sample"),
				 wxT("About Hello World"),
				 wxOK | wxICON_INFORMATION,
				 this);
}

void xcpufreqFrame::OnTimer(wxTimerEvent &WXUNUSED(event))
{
	FILE *fp = fopen("/proc/cpufreq", "r");
	if (fp != NULL)
	{
		char buf[256];
		fgets(buf, 256, fp);
		fgets(buf, 256, fp);
		fclose(fp);
		cpuLabel.SetLabel(wxString(buf, wxConvUTF8));
	}
	else
	{
		cpuLabel.SetLabel(wxT("ERROR"));
	}
}
