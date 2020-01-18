//
//  LazySingletonFactory.cs
//
//  Author:
//       ngeor
//
//  Copyright (c) 2014 ngeor
using System;

namespace NGSoftware.Common.Factories
{
    /// <summary>
    /// A factory that creates only one instance.
    /// </summary>
    public class LazySingletonFactory<T> : IFactory<T> where T : class
    {
        private readonly Lazy<T> _lazyInstance;

        /// <summary>
        /// Initializes a new instance of the <see cref="NGSoftware.Common.LazySingletonFactory`1"/> class.
        /// </summary>
        /// <param name="backend">The backend factory that actually does the work.</param>
        public LazySingletonFactory(IFactory<T> backend)
        {
            if (backend == null)
            {
                throw new ArgumentNullException("backend");
            }

            _lazyInstance = new Lazy<T>(() => backend.Create());
        }

        #region IFactory implementation
        public T Create()
        {
            return _lazyInstance.Value;
        }
        #endregion
    }
}

