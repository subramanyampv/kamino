using System;

namespace SampleProject
{
    public interface IBackend
    {
        string GetName();

        string[] GetComments(string author);
    }
}
