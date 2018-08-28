package main

import "testing"

func TestValidateSemVerTag_HappyFlow(t *testing.T) {
	data := [][]string{
		{"1.0.1", "1.0.0"},
		{"1.1.0", "1.0.0"},
		{"2.0.0", "1.0.0"},
	}

	for _, d := range data {
		t.Logf("Testing %s -> %s", d[0], d[1])
		err := ValidateSemVerTag(d[0], d[1])
		if err != nil {
			t.Error(err)
		}
	}
}

func TestValidateSemVerTag_FailedFlow(t *testing.T) {
	data := [][]string{
		{"1.0.2", "1.0.0"},
		{"1.2.0", "1.0.0"},
		{"3.0.0", "1.0.0"},
		{"1.0.0", "1.0.0"},
		{"0.0.0", "1.0.0"},
		{"", "1.2.3"},
		{"a.b.c", "1.2.4"},
		{"1.5.0", "1.4.0z"},
		{"1.5.0", "v1.4.0"},
	}

	for _, d := range data {
		t.Logf("Testing %s -> %s", d[0], d[1])
		err := ValidateSemVerTag(d[0], d[1])
		if err == nil {
			t.Error("Expected test to fail!")
		}
	}
}
