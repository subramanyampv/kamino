// --------------------------------------------------------------------------------
// <copyright file="IFactory.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------
namespace NGSoftware.Common.Factories
{
	/// <summary>
	/// Generic factory interface.
	/// </summary>
	/// <typeparam name="T">
	/// The type that this factory can create.
	/// </typeparam>
	public interface IFactory<out T> where T : class
	{
		/// <summary>
		/// Creates an instance.
		/// </summary>
		/// <returns>A new instance.</returns>
		T Create();
	}
}