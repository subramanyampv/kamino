using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SshDemo
{
    class DfCommand
    {
        public async Task<IEnumerable<DfItem>> Run(IStateControllerHost host)
        {
            var cmd = await host.Controller.RunCommand("df");
            return Parse(cmd.Result);
        }

        private IEnumerable<DfItem> Parse(string output)
        {
            // skip header (first line)
            var lines = output.Split(new[] {'\r', '\n'}, StringSplitOptions.RemoveEmptyEntries).Skip(1);
            var p = from line in lines select line.Split(new[] {' ', '\t'}, StringSplitOptions.RemoveEmptyEntries);
            return from parts in p select new DfItem
                {
                    FileSystem = parts[0],
                    Size = long.Parse(parts[1]),
                    Used = long.Parse(parts[2]),
                    Avail = long.Parse(parts[3]),
                    Percent = parts[4],
                    MountPoint = parts[5]
                };
        }
    }
}
