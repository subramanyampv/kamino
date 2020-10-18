using System;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;


namespace W3CValidationTasks.MSBuild
{
    //<UsingTask AssemblyFile="$(W3CValidationTasksLib)" TaskName="W3CValidationTasks.MSBuild.RegexReplace" />
    public class RegexReplace : Task
    {
        public string File { get; set; }

        public string ToFile { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string Replacement { get; set; }

        public override bool Execute()
        {
            try
            {
                string content = System.IO.File.ReadAllText(File);
                content = System.Text.RegularExpressions.Regex.Replace(content, Token, Replacement);
                System.IO.File.WriteAllText(ToFile, content);
                return true;
            }
            catch (Exception ex)
            {
                Log.LogErrorFromException(ex);
                return false;
            }
        }
    }
}
