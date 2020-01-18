namespace SshDemo
{
    static class Utils
    {
        /// <summary>
        /// Format a kilobyte amount into a human readable text.
        /// </summary>
        /// <param name="kiloBytes">The amount of kilobytes.</param>
        /// <returns>A human readable text representation.</returns>
        public static string FmtKiloBytes(double kiloBytes)
        {
            string[] suffix = new[] { "KB", "MB", "GB", "TB" };
            int idx = 0;
            double v = kiloBytes;

            while (v > 1024 && idx < suffix.Length - 1)
            {
                v = v / 1024.0;
                idx++;
            }

            return string.Format("{0:0.##}{1}", v, suffix[idx]);
        }
    }
}