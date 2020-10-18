using System;

namespace NGSoftware.Common.Factories
{
	public class ServiceProviderFactory<T> : IFactory<T> where T : class
	{
        private readonly IServiceProvider _resolver;

        public ServiceProviderFactory(IServiceProvider resolver)
		{
            _resolver = resolver;
		}

		public T Create()
		{
            return (T) _resolver.GetService(typeof(T));
		}
	}
}
