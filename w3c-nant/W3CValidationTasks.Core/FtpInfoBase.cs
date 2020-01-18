using System;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Base class for FTP files and directories.
	/// </summary>
	public abstract class FtpInfoBase
	{
		private readonly FtpWebRequestFactory _ftpWebRequestFactory;
		private readonly string _url;
		private readonly ILogger _logger;

		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="ftpWebRequestFactory">A factory for <see cref="System.Net.FtpWebRequest"/> instances.</param>
		/// <param name="url">The FTP url of the file or directory.</param>
		/// <param name="logger">The logging component.</param>
		public FtpInfoBase(FtpWebRequestFactory ftpWebRequestFactory, string url, ILogger logger)
		{
			_ftpWebRequestFactory = ftpWebRequestFactory;
			_url = url;
			_logger = logger;
		}

		/// <summary>
		/// Gets the FTP Web Request Factory.
		/// </summary>
		public FtpWebRequestFactory FtpWebRequestFactory
		{
			get
			{
				return _ftpWebRequestFactory;
			}
		}

		/// <summary>
		/// Gets the remote FTP url of this file or directory.
		/// </summary>
		public string Url
		{
			get
			{
				return _url;
			}
		}

		/// <summary>
		/// Gets the logging component.
		/// </summary>
		public ILogger Logger
		{
			get
			{
				return _logger;
			}
		}

		/// <summary>
		/// Safely run an FTP request, handling all exceptions that might occur.
		/// Errors will be logged as info messages.
		/// </summary>
		/// <param name="requestCreator">A method that creates and prepares the FTP request.</param>
		/// <param name="responseHandler">A method that handles the response and gets the result value out of it.</param>
		/// <param name="defaultValue">The value to return in case of an error.</param>
		/// <param name="errorMessage">The error message to prepend in the log message.</param>
		/// <returns>The result value returned by <paramref name="responseHandler"/> if the request
		/// executes successfully; the value passed at <paramref name="defaultValue"/> in case on an error.</returns>
		protected T Run<T>(Func<FtpWebRequest> requestCreator, Func<FtpWebResponse, T> responseHandler, T defaultValue, string errorMessage)
		{
			FtpWebResponse response = null;
			T result;

			try
			{
				response = (FtpWebResponse)requestCreator().GetResponse();
				result = responseHandler(response);
			}
			catch (Exception ex)
			{
				WebException webEx = ex as WebException;
				if (webEx != null)
				{
					response = webEx.Response as FtpWebResponse;
				}

				if (response != null)
				{
					FtpStatusCode status = response.StatusCode;
					Logger.Info(string.Format("Error {0} {1}: HTTP {2} - {3}", errorMessage, Url, (int)status, status));
				}
				else
				{
					Logger.Info(string.Format("Error {0} {1}: {2}", errorMessage, Url, ex.Message));
				}

				result = defaultValue;
			}
			finally
			{
				response.SafeDispose();
			}

			return result;
		}

		/// <summary>
		/// Safely run an FTP request, handling all exceptions that might occur.
		/// Errors will be logged as warnings.
		/// </summary>
		/// <param name="requestCreator">A method that creates and prepares the FTP request.</param>
		/// <param name="errorMessage">The error message to prepend in the log message.</param>
		/// <returns>The FTP status code of the response.</returns>
		protected FtpStatusCode Run(Func<FtpWebRequest> requestCreator, string errorMessage)
		{
			FtpWebResponse response = null;
			FtpStatusCode status;

			try
			{
				response = (FtpWebResponse)requestCreator().GetResponse();
				status = FtpStatusCode.CommandOK;
			}
			catch (Exception ex)
			{
				WebException webEx = ex as WebException;
				if (webEx != null)
				{
					response = webEx.Response as FtpWebResponse;
				}

				if (response != null)
				{
					status = response.StatusCode;
					Logger.Warn(string.Format("{0} {1}: HTTP {2} - {3}", errorMessage, Url, (int)status, status));
				}
				else
				{
					Logger.Warn(string.Format("{0} {1}: {2}", errorMessage, Url, ex.Message));
					status = FtpStatusCode.BadCommandSequence;
				}
			}
			finally
			{
				response.SafeDispose();
			}

			return status;
		}
	}
}
