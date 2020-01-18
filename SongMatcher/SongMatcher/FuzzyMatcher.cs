using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace SongMatcher
{
    public class FuzzyMatcher
    {
        // TODO:
        // assert TextMatch('joe esposito', 'joe "bean" esposito')
        // assert TextMatch('you're the best', 'you're the best around')
        public string Normalize(string x)
        {
            x = x.ToUpperInvariant();
            x = x.Normalize(NormalizationForm.FormC);
            x = x.Replace("THE ", "");
            x = Regex.Replace(x, @"[0-9\- ',!]", "");
            return x;
        }

		bool TextMatch(string requestedText, string actualFileText)
        {
			var normalizedRequestedText = Normalize(requestedText);
			var normalizedActualFileText = Normalize(actualFileText);
			return normalizedActualFileText.StartsWith(normalizedRequestedText);
        }

        IEnumerable<string> FindWithArtistAndTrack(string prefix, IEnumerable<string> files, string song)
        {
            string songArtist = song.Split('-')[0].Trim();
            string songTitle = song.Split('-')[1].Trim();
			var q = from file in files
				let fileWithoutExtension = Path.ChangeExtension(file, null)
				let fileWithoutPrefix = fileWithoutExtension.Substring(prefix.Length)
                    let fileParts = fileWithoutPrefix.Split(Path.DirectorySeparatorChar)
                    where fileParts.Length >= 3
                    let fileArtist = fileParts[fileParts.Length - 3]
                    where TextMatch(songArtist, fileArtist)
                    let fileTitle = fileParts[fileParts.Length - 1]
                    where TextMatch(songTitle, fileTitle)
                    select file;
            return q.ToArray();
        }

		IEnumerable<string> FindWithTrack(string prefix, IEnumerable<string> files, string song)
		{
			string songTitle = song.Trim();
			var q = from file in files
				let fileWithoutExtension = Path.ChangeExtension(file, null)
				let fileWithoutPrefix = fileWithoutExtension.Substring(prefix.Length)
				let fileParts = fileWithoutPrefix.Split(Path.DirectorySeparatorChar)
					where fileParts.Length >= 3
				let fileTitle = fileParts[fileParts.Length - 1]
					where TextMatch(songTitle, fileTitle)
				select file;
			return q.ToArray();
		}

		public IEnumerable<string> Find(string prefix, IEnumerable<string> files, string song)
		{
			if (song.IndexOf('-') > 0)
			{
				return FindWithArtistAndTrack(prefix, files, song);
			}

			return FindWithTrack(prefix, files, song);
		}
    }
}
