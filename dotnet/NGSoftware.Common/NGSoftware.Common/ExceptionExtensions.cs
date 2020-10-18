// --------------------------------------------------------------------------------
// <copyright file="ExceptionExtensions.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/15
// * Time: 8:48 πμ
// --------------------------------------------------------------------------------

using System;
using System.Reflection;

namespace NGSoftware.Common
{
	public static class ExceptionExtensions
	{
		public static ReflectionTypeLoadException GetReflectionTypeLoadException(this Exception outer)
		{
			if (outer == null)
			{
				return null;
			}

			ReflectionTypeLoadException rtle = outer as ReflectionTypeLoadException;
			if (rtle != null)
			{
				return rtle;
			}

			return GetReflectionTypeLoadException(outer.InnerException);
		}
	}
}