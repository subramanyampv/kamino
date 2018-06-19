package main

import (
	"flag"
	"fmt"
	"os"
)

func updateProjectFiles(dir string, version string) error {
	err := UpdatePomFiles(dir, version)
	if err != nil {
		return err
	}

	// support more project files, e.g. package.json
	return nil
}

func getCommitMessage(version string, message string) string {
	if len(message) > 0 {
		return message
	} else {
		return "Bumping version " + version
	}
}

func main() {
	var version string
	var dir string
	var noCommit bool
	var noPush bool
	var message string

	flag.StringVar(&version, "version", "", "The new version")
	flag.StringVar(&dir, "dir", ".", "The directory of the project to version")
	flag.BoolVar(&noCommit, "no-commit", false, "Does not commit or create the tag (dry run)")
	flag.BoolVar(&noPush, "no-push", false, "Does not push to remote (dry run)")
	flag.StringVar(&message, "message", "", "An optional commit message")

	flag.Parse()

	if version == "" {
		fmt.Println("Please specify version (run with -h for help)")
		os.Exit(1)
		return
	}

	// Get the current version based on git tags
	currentVersion, err := LatestVersion(dir)
	if err != nil {
		panic(err)
	}

	// Ensure semver is in expected format and it doesn't skip versions
	err = ValidateSemVerTag(dir, version, currentVersion)
	if err != nil {
		panic(err)
	}

	err = updateProjectFiles(dir, version)

	if noCommit {
		fmt.Println("Skipping commit because the no-commit flag was set")
		os.Exit(0)
		return
	}

	// commit with message bumping version
	_, err = gitCommit(dir, getCommitMessage(version, message))
	if err != nil {
		panic(err)
	}

	// create tag with message releasing version blah
	_, err = gitTag(dir, version)
	if err != nil {
		panic(err)
	}

	if noPush {
		fmt.Println("Skipping push because the no-push flag was set")
		os.Exit(0)
		return
	}

	// push commit and tags
	_, err = gitPush(dir)
	if err != nil {
		panic(err)
	}
}
