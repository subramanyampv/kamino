using System;
using NUnit.Framework;
using System.Drawing;

namespace CVRender.Tests
{
	[TestFixture]
	public class ImageComparerTest
	{
		[Test]
		public void ShouldWorkWithEqualImages()
		{
			var image1 = Image.FromStream(GetType().Assembly.GetManifestResourceStream("CVRender.Tests.TestData.0001.png")) as Bitmap;
			var image2 = Image.FromStream(GetType().Assembly.GetManifestResourceStream("CVRender.Tests.TestData.0002.png")) as Bitmap;
			var imageComparer = new ImageComparer();

			Assert.IsTrue(imageComparer.AreEqual(image1, image2));
		}

		[Test]
		public void ShouldWorkWithDifferentImages()
		{
			var image1 = Image.FromStream(GetType().Assembly.GetManifestResourceStream("CVRender.Tests.TestData.0001.png")) as Bitmap;
			var image2 = Image.FromStream(GetType().Assembly.GetManifestResourceStream("CVRender.Tests.TestData.0003.png")) as Bitmap;
			var imageComparer = new ImageComparer();

			Assert.IsFalse(imageComparer.AreEqual(image1, image2));
		}
	}
}

