package main

import (
	"os"
	"testing"
)

func TestFindFiles(t *testing.T) {
	var files []string

	visitor := func(name string, fileInfo os.FileInfo, x int) error {
		files = append(files, name)
		return nil
	}

	err := FindFiles(".", visitor)
	if err != nil {
		t.Error(err)
	}

	len := len(files)
	if len <= 0 {
		t.Errorf("Expected to find some files, was %d", len)
	}
}
