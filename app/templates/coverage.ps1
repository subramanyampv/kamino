.\packages\OpenCover.4.6.519\tools\OpenCover.Console.exe -register:user -filter:"+[<%= name %>]* -[<%= testName %>]*" -target:.\packages\NUnit.ConsoleRunner.3.7.0\tools\nunit3-console.exe -targetargs:".\<%= testName %>\bin\Debug\<%= testName %>.dll"
.\packages\ReportGenerator.2.5.10\tools\ReportGenerator.exe -reports:results.xml -targetdir:coveragereport
