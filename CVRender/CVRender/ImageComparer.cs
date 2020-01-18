using System;
using System.Drawing;

namespace CVRender
{
	public class ImageComparer
	{
		public ImageComparer()
		{
		}

		public bool AreEqual(Bitmap image1, Bitmap image2)
		{
			if (image1 == null)
			{
				throw new ArgumentNullException(nameof(image1));
			}

			if (image2 == null)
			{
				throw new ArgumentNullException(nameof(image2));
			}

			if (image1.Width != image2.Width || image1.Height != image2.Height)
			{
				return false;
			}

			for (var x = 0; x < image1.Width; x++)
			{
				for (var y = 0; y < image1.Height; y++)
				{
					var color1 = image1.GetPixel(x, y);
					var color2 = image2.GetPixel(x, y);
					if (color1 != color2)
					{
						return false;
					}
				}
			}

			return true;
		}
	}
}

