using NUnit.Framework;

namespace SongMatcher.Tests
{
    [TestFixture]
    public class FuzzyMatcherTest
    {
        [Test(Description = "can match Artist - Track in a simple Artist/Album/Track structure")]
        public void Simple()
        {
            FuzzyMatcher f = new FuzzyMatcher();
            var filenames = new[]
            {
                "/home/ngeor/iTunes/Artist/Album/Track.mp3".NormalizePath()
            };
            var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Artist - Track");
            CollectionAssert.AreEqual(filenames, result);
        }

        [Test(Description = "can match Artist - Track in a simple Artist/Album/TrackNumber Track structure")]
        public void SimpleWithTrackNumber()
        {
            FuzzyMatcher f = new FuzzyMatcher();
            var filenames = new[]
            {
                "/home/ngeor/iTunes/Artist/Album/01 Track.mp3".NormalizePath()
            };
            var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Artist - Track");
            CollectionAssert.AreEqual(filenames, result);
        }

		[Test(Description = "can match Artist - Track in a simple Artist/Album/TrackNumber Track structure")]
		public void SimpleWithTrackNumberWithAHyphen()
		{
			FuzzyMatcher f = new FuzzyMatcher();
			var filenames = new[]
				{
					"/home/ngeor/iTunes/Artist/Album/01-2 Track.mp3".NormalizePath()
				};
			var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Artist - Track");
			CollectionAssert.AreEqual(filenames, result);
		}

		[Test]
		public void ShouldMatchAllArtistsIfOnlyTrackIsGiven()
		{
			FuzzyMatcher f = new FuzzyMatcher();
			var filenames = new[]
				{
					"/home/ngeor/iTunes/Artist1/Album3/01-2 Track.mp3".NormalizePath(),
					"/home/ngeor/iTunes/Artist2/Album4/01-2 Track.mp3".NormalizePath()
				};
			var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Track");
			CollectionAssert.AreEqual(filenames, result);
		}

        [Test(Description = "match is case insensitive")]
        public void MatchIsCaseInsensitive()
        {
            FuzzyMatcher f = new FuzzyMatcher();
            var filenames = new[]
            {
                "/home/ngeor/iTunes/ARTIST/Album/01 TRACK.mp3".NormalizePath()
            };
            var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Artist - Track");
            CollectionAssert.AreEqual(filenames, result);
        }

		[Test(Description = "match is case insensitive")]
		public void MatchIgnorePunctuations()
		{
			FuzzyMatcher f = new FuzzyMatcher();
			var filenames = new[]
				{
					"/home/ngeor/iTunes/Compilations/A Tribute To Abba/03 Gimme! Gimme! Gimme! (A Man After Midnight).mp3".NormalizePath()
				};
			var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Compilations - Gimme, Gimme, Gimme (A Man After Midnight)");
			CollectionAssert.AreEqual(filenames, result);
		}

		[Test(Description = "match starts with")]
		public void MatchStartsWith()
		{
			FuzzyMatcher f = new FuzzyMatcher();
			var filenames = new[]
				{
					"/home/ngeor/iTunes/Compilations/A Tribute To Abba/03 Gimme! Gimme! Gimme! (A Man After Midnight).mp3".NormalizePath()
				};
			var result = f.Find("/home/ngeor/iTunes/".NormalizePath(), filenames, "Compilations - Gimme, Gimme, Gimme");
			CollectionAssert.AreEqual(filenames, result);
		}
    }
}
