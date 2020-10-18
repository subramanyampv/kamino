nuget install NUnit.Runners -Version 2.6.4 -OutputDirectory packages
nuget install OpenCover -Version 4.6.519 -OutputDirectory packages
REM nuget install ReportGenerator -Version 2.4.4.0 -OutputDirectory packages
nuget install coveralls.net -Version 0.412.0 -OutputDirectory packages

.\packages\OpenCover.4.6.519\tools\OpenCover.Console.exe -output:.\OpenCoverResults.xml -target:.\packages\NUnit.Runners.2.6.4\tools\nunit-console.exe -targetargs:"/nologo /noshadow .\IglooCastle.Tests\bin\Debug\IglooCastle.Tests.dll" -filter:"+[*]* -[*.Tests]*" -register:user

REM .\packages\ReportGenerator.2.4.4.0\tools\ReportGenerator.exe -reports:.\OpenCoverResults.xml -targetdir:.\report

.\packages\coveralls.net.0.412\tools\csmacnz.Coveralls.exe --opencover -i .\OpenCoverResults.xml
