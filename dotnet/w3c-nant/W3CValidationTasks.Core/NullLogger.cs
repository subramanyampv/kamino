using System;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// A stub logger that doesn't log anywhere.
	/// </summary>
	public class NullLogger : ILogger
	{
		/// <summary>
		/// Logs a debug message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		public void Debug(string message) { }

		/// <summary>
		/// Logs an info message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		public void Info(string message) { }

		/// <summary>
		/// Logs a warning message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		public void Warn(string message) { }

		/// <summary>
		/// Logs an error message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		public void Error(string message) { }
	}
}
