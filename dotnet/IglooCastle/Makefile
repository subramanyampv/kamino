DEB_ROOT=deb/igloocastle_1.0-0
DEB_DIST_LIB=$(DEB_ROOT)/usr/local/lib/igloocastle
DEB_DIST_BIN=$(DEB_ROOT)/usr/local/bin

all: run

deb: compile
	mkdir -p $(DEB_DIST_LIB)
	cp IglooCastle.CLI/bin/Debug/*.* $(DEB_DIST_LIB)
	mkdir -p $(DEB_DIST_BIN)
	cp scripts/igloocastle $(DEB_DIST_BIN)
	chmod +x $(DEB_DIST_BIN)/igloocastle # make the script executable
	mkdir -p $(DEB_ROOT)/DEBIAN
	cp scripts/control $(DEB_ROOT)/DEBIAN
	dpkg-deb --build $(DEB_ROOT)

run: test
	cd IglooCastle.CLI/bin/Debug && mono IglooCastle.CLI.exe --output=docs

test: compile
	cd IglooCastle.Tests/bin/Debug && nunit-console -noshadow -nothread IglooCastle.Tests.dll

compile: restore-packages
	xbuild

restore-packages:
	nuget restore

clean-packages:
	rm -rf packages/

clean:
	rm -rf deb/
	rm -rf IglooCastle.CLI/bin/
	rm -rf IglooCastle.Tests/bin/
	rm -rf IglooCastle.CLI/obj/
	rm -rf IglooCastle.Tests/obj/
