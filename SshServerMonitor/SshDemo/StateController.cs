using System;
using System.ComponentModel;
using System.Data;
using System.Threading.Tasks;
using Renci.SshNet;

namespace SshDemo
{
    public partial class StateController : Component
    {
        private ConnectionState _connectionState;
        private SshClient _sshClient;

        public StateController()
        {
            InitializeComponent();
        }

        public StateController(IContainer container)
        {
            container.Add(this);

            InitializeComponent();
        }

        public ConnectionState ConnectionState
        {
            get { return _connectionState; }
            private set
            {
                if (_connectionState != value)
                {
                    var oldState = _connectionState;
                    _connectionState = value;
                    FireStateChanged(oldState, value);
                }
            }
        }

        private static SshClient CreateSshClient(HostData host, string passwordOverride)
        {
            var password = passwordOverride ?? host.Password;
            if (string.IsNullOrWhiteSpace(host.PrivateKeyFile))
            {
                return new SshClient(host.Host, host.Username, password);
            }

            var privateKey = string.IsNullOrEmpty(password)
                                 ? new PrivateKeyFile(host.PrivateKeyFile)
                                 : new PrivateKeyFile(host.PrivateKeyFile, password);
            return new SshClient(host.Host, host.Username, privateKey);
        }

        public async void Connect(HostData hostData, string password)
        {
            if (ConnectionState != ConnectionState.Closed)
            {
                throw new InvalidOperationException("Connection was not closed");
            }

            ConnectionState = ConnectionState.Connecting;

            try
            {
                _sshClient = await Task.Run(() =>
                    {
                        var client = CreateSshClient(hostData, password);
                        client.Connect();
                        return client;
                    });
            }
            catch (Exception ex)
            {
                ConnectionState = ConnectionState.Closed;
                FireErrorOccurred(new RunWorkerCompletedEventArgs(null, ex, false));
                return;
            }

            ConnectionState = ConnectionState.Open;
        }

        public void Disconnect()
        {
            ConnectionState = ConnectionState.Closed;
            if (_sshClient != null)
            {
                _sshClient.Dispose();
            }

            _sshClient = null;
        }

        public Task<SshCommand> RunCommand(string commandText)
        {
            if (ConnectionState != ConnectionState.Open)
            {
                throw new InvalidOperationException();
            }

            ConnectionState = ConnectionState.Executing;

            return Task.Run(() => _sshClient.RunCommand(commandText))
                .ContinueWith(t =>
                    {
                        ConnectionState = ConnectionState.Open;
                        return t.Result;
                    }, TaskScheduler.FromCurrentSynchronizationContext());
        }

        public event EventHandler<StateChangedEventArgs> StateChanged;

        public event RunWorkerCompletedEventHandler ErrorOccurred;

        private void FireStateChanged(ConnectionState oldState, ConnectionState newState)
        {
            if (StateChanged != null)
            {
                StateChanged(this, new StateChangedEventArgs { OldState = oldState, NewState = newState });
            }
        }

        private void FireErrorOccurred(RunWorkerCompletedEventArgs args)
        {
            if (ErrorOccurred != null)
            {
                ErrorOccurred(this, args);
            }
        }
    }
}
