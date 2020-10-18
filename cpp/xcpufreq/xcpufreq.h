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

#ifndef _XCPUFREQ_H_
#define _XCPUFREQ_H_

/**
 * @short Application Main Window
 * @author Nikolaos Georgiou <ngeor@laptopaki>
 * @version 0.1
 */

class xcpufreqapp : public wxApp
{
	public:
		virtual bool OnInit();
};

class xcpufreqFrame : public wxFrame
{
	public:
		xcpufreqFrame( const wxString& title, const wxPoint& pos, const wxSize& size );
		void OnQuit( wxCommandEvent& event );
		void OnAbout( wxCommandEvent& event );
		void OnTimer( wxTimerEvent& event );
	private:
		wxDECLARE_EVENT_TABLE();
		wxTimer timer;
		wxStaticText cpuLabel;
};

enum
{
	Menu_File_Quit = 100,
	Menu_File_About,
	TIMER_ID
};

#endif // _XCPUFREQ_H_
