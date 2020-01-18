var exec = require('child_process').exec;
var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var os = require('os');
var through = require('through2');
var fs = require('fs');

/**
 * Creates a function that runs the given command.
 * @param {String} command - The command to run.
 * @returns {Function} The function that can run this task.
 */
function runTask(command) {
    var modifiedCommand = command.replace(/\\/g, path.sep);
    if (modifiedCommand.indexOf('.') === 0 && os.platform() === 'darwin') {
        modifiedCommand = 'mono ' + modifiedCommand;
    }

    return function(cb) {
        exec(modifiedCommand, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    };
}

gulp.task('nuget restore', runTask('nuget restore'));
gulp.task('nuget NUnit.Runners', runTask('nuget install NUnit.Runners -Version 2.6.4 -OutputDirectory packages'));
gulp.task('nuget OpenCover', runTask('nuget install OpenCover -Version 4.6.519 -OutputDirectory packages'));
gulp.task('nuget ReportGenerator', runTask('nuget install ReportGenerator -Version 2.5.8 -OutputDirectory packages'));
gulp.task('nuget xunit.runner.console', runTask('nuget install xunit.runner.console -OutputDirectory packages -Version 2.2.0'));

gulp.task('nuget', [
    'nuget restore',
    'nuget NUnit.Runners',
    'nuget OpenCover',
    'nuget ReportGenerator',
    'nuget xunit.runner.console'
]);

gulp.task('msbuild', runTask('msbuild /nologo /v:q'));

var nunitNoShadow = os.platform() === 'darwin' ? '-noshadow' : '/noshadow';
gulp.task('nunit', ['msbuild'], runTask('.\\packages\\NUnit.Runners.2.6.4\\tools\\nunit-console.exe .\\IglooCastle.Tests\\bin\\Debug\\IglooCastle.Tests.dll ' + nunitNoShadow));
gulp.task('xunit', ['msbuild'], runTask('.\\packages\\xunit.runner.console.2.2.0\\tools\\xunit.console.exe IglooCastle.IntegrationTests\\bin\\Debug\\IglooCastle.IntegrationTests.dll -noshadow -nologo -quiet -nocolor'));

gulp.task('opencover', ['msbuild'], runTask('.\\packages\\OpenCover.4.6.519\\tools\\OpenCover.Console.exe -output:.\\OpenCoverResults.xml -target:.\\packages\\NUnit.Runners.2.6.4\\tools\\nunit-console.exe -targetargs:"/nologo /noshadow .\\IglooCastle.Tests\\bin\\Debug\\IglooCastle.Tests.dll" -filter:"+[*]* -[*.Tests]*" -register:user'));
gulp.task('cover', ['opencover'], runTask('.\\packages\\ReportGenerator.2.5.8\\tools\\ReportGenerator.exe -reports:.\\OpenCoverResults.xml -targetdir:.\\coverage'));

/**
 * Creates a watch task that watches CSharp files.
 * @param {String} taskName - The name of the gulp task to create.
 * @param {String[]} tasks - The tasks to run.
 */
function createWatchCSharpTask(taskName, tasks) {
    gulp.task(taskName, function() {
        var watcher = gulp.watch('IglooCastle.*/**/*.cs', tasks);
        watcher.on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
}

createWatchCSharpTask('watch', ['msbuild', 'nunit']);
createWatchCSharpTask('watch-msbuild', ['msbuild']);
createWatchCSharpTask('watch-xunit', ['msbuild', 'xunit']);
createWatchCSharpTask('watch-cover', ['cover']);

gulp.task('clean-coverage', function() {
    return gulp.src([
        'coverage',
        'OpenCoverResults.xml',
        'TestResult.xml'
    ], { read: false }).pipe(clean());
});

gulp.task('clean-packages', function() {
    return gulp.src('packages', { read: false }).pipe(clean());
});

gulp.task('clean-bin-obj', function() {
    return gulp.src([
        '*/bin',
        '*/obj'
    ], { read: false }).pipe(clean());
})

gulp.task('clean', ['clean-coverage', 'clean-packages', 'clean-bin-obj']);
gulp.task('build', ['msbuild']);
gulp.task('default', ['build']);
gulp.task('test', ['nunit', 'xunit']);


function glob(directory, cb) {
    var result = [];

    fs.readdir(directory, function(err, files) {
        var isDirectory = [];
        var absoluteFiles = files.map(f => path.join(directory, f));
        var isDirectory = absoluteFiles.map(f => fs.statSync(f).isDirectory());
        var directoryCount = isDirectory.filter(t => t).length;
        var completedCallbacks = 0;

        for (var i = 0; i < files.length; i++) {
            var file = absoluteFiles[i];
            if (isDirectory[i]) {
                glob(file, function(err2, files2) {
                    result = result.concat(files2);
                    completedCallbacks++;
                    if (completedCallbacks === directoryCount) {
                        cb(err, result);
                    }
                });
            } else {
                result.push(file);
            }
        }

        if (completedCallbacks === directoryCount) {
            cb(err, result);
        }
    });
}

/**
 * Converts a file into a string.
 * @returns {String} The string representation.
 */
function bufferToString(file) {
    return file.contents.toString('utf8');
}

function rebuildCSProj() {
    var stream = through.obj(function(file, enc, cb) {
        if (!file.isBuffer()) {
            throw new Error('Only buffers are supported');
        }

        console.log(file.path);

        var _this = this;

        var directory = path.dirname(file.path);
        //console.log(file.contents.toString('utf8'));

        glob(directory, function(err, files) {
            var relativeFiles = files.map(f => path.relative(directory, f))
                .filter(f => path.extname(f) === '.cs')
                .sort();

            var contents = bufferToString(file);
            var idx = contents.indexOf('<Compile ');
            var lastIdx = contents.lastIndexOf('<Compile ');
            var lidx = contents.indexOf('/>', lastIdx);
            var newFiles = relativeFiles.map(f => `<Compile Include="${f}" />`);
            newFiles = newFiles.reduce((prev,curr) => prev + os.EOL + "    " + curr);
            var newContents = contents.substring(0, idx) + newFiles + contents.substring(lidx + 2);

            file.contents = Buffer.from(newContents);

            _this.push(file);

            cb();
        });
    });

    return stream;
}

gulp.task('rebuildcsproj', function() {
    gulp.src('Igloo*/*.csproj')
        .pipe(rebuildCSProj())
        .pipe(gulp.dest('.'));
});
