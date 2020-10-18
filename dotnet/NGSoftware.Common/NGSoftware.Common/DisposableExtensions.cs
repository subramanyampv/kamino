// --------------------------------------------------------------------------------
// <copyright file="DisposableExtensions.cs" company="Nikolaos Georgiou">
//   Copyright (C) Nikolaos Georgiou 2010-2015
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2015/11/28
// * Time: 06:12:50
// --------------------------------------------------------------------------------
using System;

namespace NGSoftware.Common
{
	/// <summary>
	/// Extensions for <see cref="IDisposable"/>.
	/// </summary>
	public static class DisposableExtensions
	{
		/// <summary>
		/// Disposes of the object, suppresing any exception that might occur during disposal.
		/// </summary>
		/// <param name="disposable">The disposable.</param>
		public static void SafeDispose(this IDisposable disposable)
		{
			if (disposable == null)
			{
				return;
			}

			try
			{
				disposable.Dispose();
			}
			catch
			{
			}
		}
	}
}

