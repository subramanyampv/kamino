Remove-Item -Force .\opencover.xml
nuget install OpenCover -Version 4.6.519 -OutputDirectory packages
nuget install ReportGenerator -Version 3.1.2 -OutputDirectory packages

.\packages\OpenCover.4.6.519\tools\OpenCover.Console.exe `
    -oldstyle `
    -output:opencover.xml `
    -register:user `
    -filter:"+[NGSoftware*]* -[*.Tests]*" `
    -target:"C:\Program Files\dotnet\dotnet.exe" `
    -targetargs:"test --no-build NGSoftware.Common.Tests"

.\packages\ReportGenerator.3.1.2\tools\ReportGenerator.exe -reports:opencover.xml -targetdir:coverage
