using System;
using System.Threading;

namespace NGSoftware.Common
{
	public interface IStoppable : IDisposable
	{
		bool IsStopRequested();

		/// <summary>
		/// Registers an action to be executed when the token has been cancelled.
		/// </summary>
		/// <param name="callback">The action to execute.</param>
		/// <returns>The registration token.</returns>
		CancellationTokenRegistration Register(Action callback);

		void RequestStop();

		void Sleep(DateTime until, int milliseconds = 100);
		void Sleep(TimeSpan duration, int milliseconds = 100);

		void SleepWhile(Func<bool> condition, DateTime until, int milliseconds = 100);
		void SleepWhile(Func<bool> condition, TimeSpan duration, int milliseconds = 100);
	}
}
