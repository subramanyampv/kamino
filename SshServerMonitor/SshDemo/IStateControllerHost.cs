namespace SshDemo
{
    public interface IStateControllerHost
    {
        StateController Controller { get; }
        HostData SelectedHost { get; }
    }
}