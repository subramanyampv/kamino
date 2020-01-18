// --------------------------------------------------------------------------------
// <copyright file="FuncFactory.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/10/07
// * Time: 10:17 πμ
// --------------------------------------------------------------------------------

using System;

namespace NGSoftware.Common.Factories
{
	public class FuncFactory<T> : IFactory<T> where T : class
	{
		private readonly Func<T> _func;

		public FuncFactory(Func<T> func)
		{
			_func = func;
		}

		public T Create()
		{
			return _func();
		}
	}
}