package main

import (
	"fmt"
	"os/exec"
	"sort"
	"strconv"
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
	cmdOutAsString, err := gitCommand(gitDir, "commit", "-m", msg)
	if err != nil {
		// maybe it is "nothing to commit, working tree clean"
		if strings.Contains(cmdOutAsString, "nothing to commit, working tree clean") {
			// do not indicate an error in this case
			return cmdOutAsString, nil
		}
	}

	return cmdOutAsString, err
}

func gitTag(gitDir string, version string) (string, error) {
	return gitCommand(gitDir, "tag", "-m", "Releasing version "+version, "v"+version)
}

func gitPush(gitDir string) (string, error) {
	return gitCommand(gitDir, "push", "--follow-tags")
}

func compareSplittedSemVerTag(x, y []string) int {
	if len(x) < len(y) {
		return -1
	} else if len(x) > len(y) {
		return 1
	}

	result := 0

	// normal case here, equal arrays
	for i := 0; i < len(x); i++ {
		xTrimmed := strings.TrimPrefix(x[i], "v")
		yTrimmed := strings.TrimPrefix(y[i], "v")

		xInt, err := strconv.Atoi(xTrimmed)
		if err != nil {
			// compare as strings
			result = strings.Compare(xTrimmed, yTrimmed)
		} else {
			yInt, err := strconv.Atoi(yTrimmed)
			if err != nil {
				result = strings.Compare(xTrimmed, yTrimmed)
			} else {
				result = xInt - yInt
			}
		}

		if result != 0 {
			return result
		}
	}

	return 0
}

func compareSemVerTag(x, y string) int {
	return compareSplittedSemVerTag(strings.Split(x, "."), strings.Split(y, "."))
}

// LatestVersion gets the most recent version based on the git tags.
// The 'v' prefix of the tag is removed.
func LatestVersion(gitDir string) (string, error) {
	cmdOutAsString, err := gitCommand(gitDir, "tag")

	if err != nil {
		return "", err
	}

	tagArray := strings.Split(cmdOutAsString, "\n")
	sort.Slice(tagArray, func(i, j int) bool {
		return compareSemVerTag(tagArray[i], tagArray[j]) < 0
	})

	for i := len(tagArray) - 1; i >= 0; i-- {
		tag := tagArray[i]
		if tag != "" {
			return strings.TrimPrefix(tag, "v"), nil
		}
	}

	return "", nil
}
