#if !defined MAIN_WINDOW_H
#define MAIN_WINDOW_H
#include "StdAfx.h"
#include "App.h"
#include "MessageHandlers.h"
#include "AbstractTree.h"
#include "TreeFactory.h"
#include "AbstractDialog.h"

class MainWindow : public AbstractDialog
{
private:
	TreeFactory treeFactory;
	AbstractTree *myTree;
	void OpenTreeFile(LPCTSTR szFile);
	void OnOpenTreeFile();
	void OnSaveMetafile();
	void OnAdd();
	void SetKeyType(KeyType keyType);
	void KeyTypeChanged(KeyType keyType);
	void SetTreeType(TreeType treeType);
	void TreeTypeChanged(TreeType treeType);
	LRESULT OnCommand(UINT message, WPARAM wParam, LPARAM lParam);
	void SizeControls();

public:
	MainWindow(App &app);
	virtual ~MainWindow();
	virtual LRESULT WndProc(UINT, WPARAM, LPARAM) override;
};

#endif
