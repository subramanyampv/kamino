using System;
using System.Data;

namespace SshDemo
{
    public class StateChangedEventArgs : EventArgs
    {
        public ConnectionState OldState { get; set; }
        public ConnectionState NewState { get; set; }
    }
}