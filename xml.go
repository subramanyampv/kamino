package main

import (
	"errors"
	"strings"
)

// Parser holds a buffer and the current position
type Parser struct {
	contents string
	position int
}

type parserEvents interface {
	Element(name string)
	Contents(contents string)
	Declaration(declaration string)
}

func (p *Parser) isEOF() bool {
	return p.position >= len(p.contents)
}

func (p *Parser) currentByte() byte {
	return p.contents[p.position]
}

func (p *Parser) current() string {
	return string(p.contents[p.position])
}

func (p *Parser) skip() {
	p.position = p.position + 1
}

func parseDeclaration(p *Parser, parserEvents parserEvents) bool {
	if !p.isEOF() && p.current() == "?" {
		// we're in something like <?xml version="1.0"?>

		// skip '?'
		p.skip()

		declaration := "?"
		for !p.isEOF() && p.current() != ">" {
			declaration = declaration + p.current()
			p.skip()
		}

		// read past closing ">"
		if !p.isEOF() {
			p.skip()
		}

		parserEvents.Declaration(declaration)

		return true
	}

	return false
}

func (p *Parser) parseOpenTag(parserEvents parserEvents) {
	if p.current() != "<" {
		return
	}

	p.skip()

	if parseDeclaration(p, parserEvents) {
		return
	}

	tag := ""
	for !p.isEOF() && p.current() != ">" {
		tag = tag + p.current()
		p.skip()
	}

	// read past closing ">"
	if !p.isEOF() {
		p.skip()
	}

	parserEvents.Element(tag)
}

func (p *Parser) parseContents(parserEvents parserEvents) {
	buffer := ""
	for !p.isEOF() && p.current() != "<" {
		buffer = buffer + p.current()
		p.skip()
	}

	parserEvents.Contents(buffer)
}

func (p *Parser) parse(parserEvents parserEvents) error {
	for !p.isEOF() {
		oldPosition := p.position
		p.parseOpenTag(parserEvents)
		p.parseContents(parserEvents)

		if oldPosition == p.position {
			return errors.New("Could not parse file")
		}
	}

	return nil
}

type consoleParserEvents struct {
	newVersion     string
	versionLocator func([]string) bool
	stack          []string
	buffer         string
}

func (p *consoleParserEvents) Element(name string) {
	p.buffer = p.buffer + "<" + name + ">"
	if strings.HasPrefix(name, "/") {
		p.stack = p.stack[:len(p.stack)-1]
	} else {
		p.stack = append(p.stack, name)
	}
}

func (p *consoleParserEvents) Contents(value string) {
	if p.versionLocator(p.stack) {
		p.buffer = p.buffer + p.newVersion
	} else {
		p.buffer = p.buffer + value
	}
}

func (p *consoleParserEvents) Declaration(value string) {
	p.buffer = p.buffer + "<" + value + ">"
}
