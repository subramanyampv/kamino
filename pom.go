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

func isSubDir(fileInfo os.FileInfo) bool {
	if !fileInfo.IsDir() {
		return false
	}

	name := fileInfo.Name()
	return name != ".git" && name != ".idea"
}

// UpdatePomFiles updates pom files with the new version.
// pom.xml files in subdirectories are considered child modules of the parent
// directory.
func UpdatePomFiles(gitDir string, version string) error {
	filename := filepath.Join(gitDir, "pom.xml")
	_, err := os.Stat(filename)
	if err != nil {
		if os.IsNotExist(err) {
			// not a maven project
			return nil
		}

		return err
	}

	fmt.Println("Updating pom.xml")
	err = updateStandalonePomVersion(filename, version)
	if err != nil {
		return err
	}

	_, err = gitAdd(gitDir, "pom.xml")
	if err != nil {
		return err
	}

	// if there are children pom files in subdirectories, we are looking at a multi-module project
	folders, err := ioutil.ReadDir(gitDir)
	if err != nil {
		return err
	}

	for _, f := range folders {
		if isSubDir(f) {
			fmt.Println("Searching for child pom in ", f.Name())
			childPomFilename := filepath.Join(gitDir, f.Name(), "pom.xml")
			childPomFileInfo, err := os.Stat(childPomFilename)
			if err != nil && !os.IsNotExist(err) {
				return err
			}

			if err == nil && !childPomFileInfo.IsDir() && childPomFileInfo.Size() > 0 {
				fmt.Println("Found child pom", childPomFilename)

				err = updateChildPomVersion(childPomFilename, version)
				if err != nil {
					return err
				}

				_, err = gitAdd(gitDir, filepath.Join(f.Name(), "pom.xml"))
				if err != nil {
					return err
				}
			}
		}
	}

	return nil
}
