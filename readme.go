package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

func replaceTextInFile(filename string, version string, currentVersion string) error {
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}

	oldContents := string(bytes)
	newContents := strings.Replace(oldContents, currentVersion, version, -1) // -1 = replace all

	if oldContents == newContents {
		return nil
	}

	return ioutil.WriteFile(filename, []byte(newContents), 0644)
}

// UpdateReadmeFiles updates README.md files with the new version.
func UpdateReadmeFiles(gitDir string, version string, currentVersion string) error {
	return FindFiles(gitDir, func(path string, fileInfo os.FileInfo, level int) error {
		if fileInfo.Name() != "README.md" {
			return nil
		}

		relpath, err := filepath.Rel(gitDir, path)
		if err != nil {
			return err
		}

		fmt.Println("Found README.md", relpath)
		err = replaceTextInFile(path, version, currentVersion)
		if err != nil {
			return err
		}

		_, err = gitAdd(gitDir, relpath)
		return err
	})
}
