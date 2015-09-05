# generator-csharp-cli-app
Yeoman generator for a C# command line app with NuGet package restore, log4net and unit tests.

## Installation

You can install via npm:

	npm install -g generator-csharp-cli-app

## Usage

Create a folder named after the project you want to create, e.g. MyApp. Inside that folder, run:

	yo csharp-cli-app

You will be asked to enter:

- the project name (by default it is the folder name you're in)
- the company name (it will be added in the AssemblyInfo.cs files)

This command will create a Visual Studio solution that consists of a console application and an NUnit class library for unit tests.

In the following example you can get an idea of the files and folders you end up with.

	ngeor@box-CP6230:~$ mkdir MyApp
	ngeor@box-CP6230:~$ cd MyApp/
	ngeor@box-CP6230:~/MyApp$ yo csharp-cli-app
	? Your project name: MyApp
	? Company name (for AssemblyInfo.cs copyright fields) My Company
	   create .gitignore
	   create .nuget/NuGet.Config
	   create .nuget/NuGet.exe
	   create .nuget/NuGet.targets
	   create MyApp.sln
	   create packages/repositories.config
	   create MyApp/Program.cs
	   create MyApp/Properties/AssemblyInfo.cs
	   create MyApp/App.config
	   create MyApp/packages.config
	   create MyApp/MyApp.csproj
	   create MyApp.Tests/ProgramTest.cs
	   create MyApp.Tests/Properties/AssemblyInfo.cs
	   create MyApp.Tests/packages.config
	   create MyApp.Tests/MyApp.Tests.csproj

What you'll also get:

- NuGet package restore is already enabled
- A `.gitignore` file
- log4net for both the console app and the test library
- NUnit and Moq for the test library
- the console app internals are visible to the test library
- the copyright information is filled in in the AssemblyInfo.cs files
