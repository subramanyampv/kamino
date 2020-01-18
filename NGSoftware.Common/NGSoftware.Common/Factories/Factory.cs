// --------------------------------------------------------------------------------
// <copyright file="Factory.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/10/07
// * Time: 10:17 πμ
// --------------------------------------------------------------------------------

using System;

namespace NGSoftware.Common.Factories
{
	public static class Factory
	{
		public static IFactory<T> From<T>(T instance) where T : class
		{
			return new SingleInstanceFactory<T>(instance);
		}

		public static IFactory<T> From<T>(Func<T> func) where T : class
		{
			return new FuncFactory<T>(func);
		}
	}
}