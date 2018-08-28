package main

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Finds the next valid semantic versions
func allowedNextVersions(currentVersion string) ([]string, error) {
	components := strings.Split(currentVersion, ".")
	numericComponents := make([]int, len(components))
	allowedVersions := make([]string, len(components))
	var err error
	for index := 0; index < len(components); index++ {
		numericComponents[index], err = strconv.Atoi(components[index])
		if err != nil {
			return nil, err
		}

		allowedVersions[index] = ""

		for i := 0; i < len(components); i++ {
			if i > 0 {
				allowedVersions[index] = allowedVersions[index] + "."
			}

			if i == index {
				// bump
				allowedVersions[index] = allowedVersions[index] + strconv.Itoa(1+numericComponents[i])
			} else if i < index {
				// keep original
				allowedVersions[index] = allowedVersions[index] + components[i]
			} else {
				// zero
				allowedVersions[index] = allowedVersions[index] + "0"
			}
		}
	}

	return allowedVersions, nil
}

func isSemVerFormat(version string) (bool, error) {
	return regexp.MatchString("^[0-9]+\\.[0-9]+\\.[0-9]+$", version)
}

// ValidateSemVerTag ensures that the given tag is a valid semver version,
// following the format major.minor.patch.
// Additionally, it checks that no versions are skipped.
// For example, if the current version is 1.2.3, the allowed versions are:
// 1.2.4, 1.3.0 and 2.0.0
func ValidateSemVerTag(newVersion string, currentVersion string) error {
	matched, err := isSemVerFormat(newVersion)
	if err != nil {
		return err
	}

	if !matched {
		return errors.New("Wrong tag format. Must be 0-9.0-9.0-9")
	}

	matched, err = isSemVerFormat(currentVersion)
	if err != nil {
		return err
	}

	if !matched {
		return fmt.Errorf("Existing tag is not in semver format: %s", currentVersion)
	}

	allowedNextVersions, err := allowedNextVersions(currentVersion)
	if err != nil {
		return err
	}

	found := false
	for index := 0; !found && index < len(allowedNextVersions); index++ {
		found = allowedNextVersions[index] == newVersion
	}

	if !found {
		return fmt.Errorf("Skipping versions is not allowed. Allowed versions: %s", allowedNextVersions)
	}

	return nil
}
