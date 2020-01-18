all: bin/xcpufreq

bin/xcpufreq: xcpufreq.cpp
	mkdir -p bin
	g++ -std=c++0x -o bin/xcpufreq xcpufreq.cpp `wx-config --cppflags --libs`

bin/xcpufreq.app/Contents/MacOS/xcpufreq: bin/xcpufreq
	mkdir -p bin/xcpufreq.app/Contents/MacOS
	cp bin/xcpufreq bin/xcpufreq.app/Contents/MacOS/

mac: bin/xcpufreq.app/Contents/MacOS/xcpufreq

clean:
	rm -rf bin/
