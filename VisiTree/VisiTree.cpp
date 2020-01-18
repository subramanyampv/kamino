// VisiTree.cpp : Defines the entry point for the application.

#include "StdAfx.h"
#include "App.h"
#include "MainWindow.h"

int APIENTRY WinMain(HINSTANCE hInstance,
					 HINSTANCE hPrevInstance,
					 LPSTR lpCmdLine,
					 int nCmdShow)
{
	// Create app instance
	App app(hInstance);

	// Create Window
	MainWindow mainWindow(app);
	mainWindow.Create();

	// Register the message handler
	app.Add(mainWindow.CreateDialogMessageHandler());

	// Show the Window
	mainWindow.Show();

	// App loop
	return app.Run();
}
