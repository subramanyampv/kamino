using System;
using System.IO;
using System.IO.IsolatedStorage;
using System.Xml.Serialization;

namespace SshDemo
{
    [Serializable]
    public class Settings
    {
        const string Filename = "settings.xml";

        HostData[] _hosts;

        public static Settings Instance
        {
            get;
            set;
        }

        public HostData[] Hosts
        {
            get
            {
                return _hosts ?? new HostData[0];
            }
            set
            {
                _hosts = value;
            }
        }

        public static Settings Load()
        {
            using (IsolatedStorageFile isoStore = IsolatedStorageFile.GetStore(IsolatedStorageScope.User | IsolatedStorageScope.Domain | IsolatedStorageScope.Assembly, null, null))
            {
                if (isoStore.FileExists(Filename))
                {
                    using (IsolatedStorageFileStream stream = isoStore.OpenFile(Filename, FileMode.Open))
                    {
                        XmlSerializer serializer = new XmlSerializer(typeof(Settings));
                        Settings settings = (Settings)serializer.Deserialize(stream);
                        stream.Close();
                        return settings;
                    }
                }
            }

            return new Settings();
        }

        public void Save()
        {
            using (IsolatedStorageFile isoStore = IsolatedStorageFile.GetStore(IsolatedStorageScope.User | IsolatedStorageScope.Domain | IsolatedStorageScope.Assembly, null, null))
            {
                using (IsolatedStorageFileStream stream = isoStore.CreateFile(Filename))
                {
                    XmlSerializer serializer = new XmlSerializer(typeof(Settings));
                    serializer.Serialize(stream, this);
                    stream.Flush();
                    stream.Close();
                }
            }
        }
    }
}
