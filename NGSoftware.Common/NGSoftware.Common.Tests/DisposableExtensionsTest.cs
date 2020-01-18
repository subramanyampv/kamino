// --------------------------------------------------------------------------------
// <copyright file="DisposableExtensionsTest.cs" company="Nikolaos Georgiou">
//   Copyright (C) Nikolaos Georgiou 2010-2015
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2015/11/28
// * Time: 06:10:40
// --------------------------------------------------------------------------------
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace NGSoftware.Common.Tests
{
	[TestClass]
	public class DisposableExtensionsTest
	{
		[TestMethod]
		public void ShouldDispose()
		{
			Mock<IDisposable> mockDisposable = new Mock<IDisposable>(MockBehavior.Strict);
			mockDisposable.Setup(p => p.Dispose());
			mockDisposable.Object.SafeDispose();
			mockDisposable.Verify(p => p.Dispose(), Times.Once());
		}

		[TestMethod]
		public void ShouldNotDisposeNulls()
		{
			IDisposable d = null;
			d.SafeDispose();
		}

		[TestMethod]
		public void ShouldNotThrowIfDisposeThrows()
		{
			Mock<IDisposable> mockDisposable = new Mock<IDisposable>(MockBehavior.Strict);
			mockDisposable.Setup(p => p.Dispose()).Throws(new InvalidOperationException());
			mockDisposable.Object.SafeDispose();
			mockDisposable.Verify(p => p.Dispose(), Times.Once());
		}
	}
}

