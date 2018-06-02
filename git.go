package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func gitCommand(gitDir string, arguments ...string) (string, error) {
	cmd := exec.Command("git", arguments...)
	cmd.Dir = gitDir
	cmdOut, err := cmd.CombinedOutput()
	cmdOutAsString := string(cmdOut)

	if err != nil {
		fmt.Println(cmdOutAsString)
	}

	return cmdOutAsString, err
}

func gitAdd(gitDir string, file string) (string, error) {
	return gitCommand(gitDir, "add", file)
}

func gitCommit(gitDir string, msg string) (string, error) {
	return gitCommand(gitDir, "commit", "-m", msg)
}

func gitTag(gitDir string, version string) (string, error) {
	return gitCommand(gitDir, "tag", "-m", "Releasing version "+version, "v"+version)
}

func gitPush(gitDir string) (string, error) {
	return gitCommand(gitDir, "push", "--follow-tags")
}

// LatestVersion gets the most recent version based on the git tags.
// The 'v' prefix of the tag is removed.
func LatestVersion(gitDir string) (string, error) {
	cmdOutAsString, err := gitCommand(gitDir, "tag")

	if err != nil {
		return "", err
	}

	tagArray := strings.Split(cmdOutAsString, "\n")
	for i := len(tagArray) - 1; i >= 0; i-- {
		tag := tagArray[i]
		if tag != "" {
			return strings.TrimPrefix(tag, "v"), nil
		}
	}

	return "", nil
}
