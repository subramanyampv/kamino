using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Diagnostics;

namespace SongMatcher
{
	class Program
	{
		// const string PlayListFile = @"C:\Users\Nikolaos\ownCloud\Fitness\Running\playlist.txt";
		const string PlayListFile = @"/home/ngeor/ownCloud/Fitness/Running/playlist.txt";

		// very important that MusicLibrary ends in path separator
		// otherwise the substring function results paths starting with \
		// const string MusicLibrary = @"Y:\remote-mirror\mac\local-mirror\Music\iTunes\iTunes Music\";
		const string MusicLibrary = @"/tank/remote-mirror/mac/local-mirror/Music/iTunes/iTunes Music/";
		// const string Dest = @"D:\Music\";
		// const string Dest = @"/media/ngeor/A8F4-EB79/Music/";
		const string Dest = @"/tmp/Music/";

		const string CacheFile = "cache.txt";

		const bool ConvertNonMp3 = false;

        readonly FuzzyMatcher fuzzyMatcher = new FuzzyMatcher();

		string[] GetLibraryFiles()
		{
			if (File.Exists(CacheFile))
			{
				return File.ReadAllLines(CacheFile);
			}

			string[] files = Directory.GetFiles(MusicLibrary, "*.*", SearchOption.AllDirectories);
			File.WriteAllLines(CacheFile, files);
			return files;
		}

		string[] Find(string song)
		{
			string[] files = GetLibraryFiles();
            return fuzzyMatcher.Find(MusicLibrary, files, song).ToArray();
		}

		void CopyFile(string source, string dest)
		{
			if (Path.GetExtension(source) == ".mp3" || !ConvertNonMp3)
			{
				Console.WriteLine("Copying {0} to {1}", source, dest);
				File.Copy(source, dest);
			}
			else
			{
				// use avconv
				string commandLine = string.Format(@"-i ""{0}"" ""{1}""", source, dest);
				Console.WriteLine("Launching avconv {0}", commandLine);
				Process p = Process.Start("avconv", commandLine);
				p.WaitForExit();
			}
		}

		void Run()
		{
			string[] songs = File.ReadAllLines(PlayListFile)
				.Where(s => !string.IsNullOrWhiteSpace(s))
				.ToArray();

			List<string[]> songMatches = new List<string[]>();
			foreach (var song in songs)
			{
				Console.WriteLine("Scanning for {0} as {1}", song, fuzzyMatcher.Normalize(song));

				var matches = Find(song);
				songMatches.Add(matches);
				if (matches.Any())
				{
					Console.WriteLine(song);
					foreach (var match in matches)
					{
						Console.WriteLine(match);
						string destFile = Path.ChangeExtension(
							Path.Combine(Dest, match.Substring(MusicLibrary.Length)),
							"mp3");
						Console.WriteLine(destFile);
						if (!File.Exists(destFile))
						{
							Directory.CreateDirectory(Path.GetDirectoryName(destFile));
							CopyFile(match, destFile);
							Console.WriteLine("copied");
						}
					}
				}
			}

			// print report
			var q = from i in Enumerable.Range(0, songs.Length)
				select new
				{
					RequestedSong = songs[i],
					MatchCount = songMatches[i].Length,
					HasArtist = songs[i].IndexOf('-') > 0
				};

			foreach (var result in q.OrderByDescending(s => s.MatchCount).ThenBy(s => s.HasArtist).ThenBy(s=>s.RequestedSong))
			{
				Console.WriteLine(result.RequestedSong);
			}

			foreach (var result in q)
			{
				Console.WriteLine("{0}\t{1}", result.MatchCount, result.RequestedSong);
			}
		}

		static void Main(string[] args)
		{
			Program p = new Program();
			p.Run();
			Console.WriteLine("all done!");
			Console.ReadLine();
		}
	}
}
