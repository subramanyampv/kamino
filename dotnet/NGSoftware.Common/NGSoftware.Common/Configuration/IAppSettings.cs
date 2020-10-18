namespace NGSoftware.Common.Configuration
{
    public interface IAppSettings
    {
        string this[string parameterName] { get; }
    }
}