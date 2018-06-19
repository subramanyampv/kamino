package main

import (
	"io/ioutil"
	"os"
	"path/filepath"
)

func ignoreDir(name string) bool {
	return name == ".git" || name == ".idea" || name == ".vscode" || name == "target"
}

// visitor
type visitor func(string, os.FileInfo, int) error

func findFiles(gitDir string, level int, fn visitor) error {
	folders, err := ioutil.ReadDir(gitDir)
	if err != nil {
		return err
	}

	for _, f := range folders {
		if f.IsDir() {
			if !ignoreDir(f.Name()) {
				// visit subdirectory
				err := findFiles(filepath.Join(gitDir, f.Name()), level+1, fn)
				if err != nil {
					return err
				}
			} else {
				// ignore subdirectory
			}
		} else {
			// visit file
			err := fn(filepath.Join(gitDir, f.Name()), f, level)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// FindFiles finds files in the given directory
func FindFiles(gitDir string, fn visitor) error {
	return findFiles(gitDir, 0, fn)
}
