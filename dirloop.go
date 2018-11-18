package main

import (
	"bytes"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path"
	"path/filepath"
)

// Arguments holds the command line arguments
type Arguments struct {
	Dir              string
	DirPattern       string
	DryRun           bool
	CommandName      string
	CommandArguments []string
}

// CreateCommand creates an exec.Cmd instance based on the given arguments.
func (a Arguments) CreateCommand() *exec.Cmd {
	return exec.Command(a.CommandName, a.CommandArguments...)
}

// IsMatchingDir checks if the given argument represents a directory
// and that directory's name matches the directory pattern.
func (a Arguments) IsMatchingDir(fileInfo os.FileInfo) (bool, error) {
	if !fileInfo.IsDir() {
		return false, nil
	}

	if a.DirPattern == "" {
		return true, nil
	}

	return path.Match(a.DirPattern, fileInfo.Name())
}

// Parses the command line arguments
func parseArguments() Arguments {
	var arguments Arguments
	flag.StringVar(&arguments.Dir, "dir", ".", "The root directory containing other directories")
	flag.StringVar(&arguments.DirPattern, "dir-pattern", "", "An optional wildcard pattern to select only some directories")
	flag.BoolVar(&arguments.DryRun, "dry-run", false, "Don't actually run any command")

	flag.Parse()

	remainingArguments := flag.Args()
	if len(remainingArguments) <= 0 {
		fmt.Println("Please specify the command that should be run")
		os.Exit(1)
	}

	arguments.CommandName = remainingArguments[0]
	arguments.CommandArguments = remainingArguments[1:]
	return arguments
}

func runCommand(arguments Arguments, dirName string) error {
	fullDir := filepath.Join(arguments.Dir, dirName)
	if arguments.DryRun {
		fmt.Printf("Would have run command in %s", fullDir)
		fmt.Println()
		return nil
	}

	fmt.Printf("Running command in %s", fullDir)
	fmt.Println()

	var out bytes.Buffer
	cmd := arguments.CreateCommand()
	cmd.Stdout = &out
	cmd.Dir = fullDir
	err := cmd.Run()
	if err != nil {
		return err
	}

	fmt.Printf(out.String())
	fmt.Println()
	return nil
}

func main() {
	arguments := parseArguments()

	files, err := ioutil.ReadDir(arguments.Dir)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	for _, file := range files {
		isMatchingDir, err := arguments.IsMatchingDir(file)
		if err != nil {
			log.Fatal(err)
		} else if isMatchingDir {
			err := runCommand(arguments, file.Name())
			if err != nil {
				fmt.Println(err)
			}
		}
	}
}
