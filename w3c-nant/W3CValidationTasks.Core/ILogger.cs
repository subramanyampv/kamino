using System;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Represents a logging interface.
	/// </summary>
	/// <remarks>
	/// NAnt tasks must implement a certain base class, so we can't derive from both that class
	/// and the classes that exist in this assembly. This is why we need this interface.
	/// </remarks>
	public interface ILogger
	{
		/// <summary>
		/// Logs a debug message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		void Debug(string message);

		/// <summary>
		/// Logs an info message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		void Info(string message);

		/// <summary>
		/// Logs a warning message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		void Warn(string message);

		/// <summary>
		/// Logs an error message.
		/// </summary>
		/// <param name="message">The message to log.</param>
		void Error(string message);
	}
}
