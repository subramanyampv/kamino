package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

func changeStandalonePomVersion(contents string, version string) (string, error) {
	parser := &Parser{contents: contents}
	c := &consoleParserEvents{
		newVersion: version,
		versionLocator: func(stack []string) bool {
			return len(stack) == 2 && stack[1] == "version"
		},
	}

	err := parser.parse(c)

	return c.buffer, err
}

func changeChildPomVersion(contents string, version string) (string, error) {
	parser := &Parser{contents: contents}
	c := &consoleParserEvents{
		newVersion: version,
		versionLocator: func(stack []string) bool {
			return len(stack) == 3 && stack[1] == "parent" && stack[2] == "version"
		},
	}

	err := parser.parse(c)

	return c.buffer, err
}

// updateStandalonePomVersion changes the version of a standalone pom file
func updateStandalonePomVersion(filename string, version string) error {
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}

	contents, err := changeStandalonePomVersion(string(bytes), version)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(filename, []byte(contents), 0644)
}

// updateChildPomVersion changes the version of a child pom file
func updateChildPomVersion(filename string, version string) error {
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}

	contents, err := changeChildPomVersion(string(bytes), version)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(filename, []byte(contents), 0644)
}

// UpdatePomFiles updates pom files with the new version.
// pom.xml files in subdirectories are considered child modules of the parent
// directory.
func UpdatePomFiles(gitDir string, version string) error {
	return FindFiles(gitDir, func(path string, fileInfo os.FileInfo, level int) error {
		if fileInfo.Name() != "pom.xml" {
			return nil
		}

		relpath, err := filepath.Rel(gitDir, path)
		if err != nil {
			return err
		}

		if level == 0 {
			fmt.Println("Found parent pom", relpath)
			err := updateStandalonePomVersion(path, version)
			if err != nil {
				return err
			}
		} else {
			fmt.Println("Found child pom", relpath)
			err := updateChildPomVersion(path, version)
			if err != nil {
				return err
			}
		}

		_, err = gitAdd(gitDir, relpath)
		return err
	})
}
