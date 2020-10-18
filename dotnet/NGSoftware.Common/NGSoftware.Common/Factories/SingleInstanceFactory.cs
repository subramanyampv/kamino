// --------------------------------------------------------------------------------
// <copyright file="SingleInstanceFactory.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/10/07
// * Time: 10:17 πμ
// --------------------------------------------------------------------------------
namespace NGSoftware.Common.Factories
{
	public class SingleInstanceFactory<T> : IFactory<T> where T : class
	{
		private readonly T _instance;

		public SingleInstanceFactory(T instance)
		{
			_instance = instance;
		}

		public T Create()
		{
			return _instance;
		}
	}
}