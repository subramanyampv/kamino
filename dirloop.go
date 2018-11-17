package main

import (
	"bytes"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	var dir string

	flag.StringVar(&dir, "dir", ".", "The root directory containing other directories")

	flag.Parse()

	remainingArguments := flag.Args()

	fmt.Println(remainingArguments)

	if len(remainingArguments) <= 0 {
		fmt.Println("Please specify the command that should be run")
		os.Exit(1)
	}

	cmdName := remainingArguments[0]
	args := remainingArguments[1:]

	fmt.Println(cmdName)
	fmt.Println(args)

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	for _, file := range files {
		if file.IsDir() {
			var out bytes.Buffer
			cmd := exec.Command(cmdName, args...)
			cmd.Stdout = &out
			cmd.Dir = filepath.Join(dir, file.Name())
			err := cmd.Run()
			if err != nil {
				fmt.Println(err)
			}

			fmt.Printf("result: %q", out.String())
			fmt.Println()
		}
	}
}
