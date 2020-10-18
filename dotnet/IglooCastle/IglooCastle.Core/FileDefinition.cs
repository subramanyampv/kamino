using System;

namespace IglooCastle.Core
{
    /// <summary>
    /// Defines a file by its name and its contents.
    /// </summary>
    public class FileDefinition : IEquatable<FileDefinition>
    {
        private readonly string filename;
        private readonly string contents;

        /// <summary>
        /// Creates an instance of the <see cref="FileDefinition"/> class.
        /// </summary>
        /// <param name="filename"></param>
        /// <param name="contents"></param>
        public FileDefinition(string filename, string contents)
        {
            this.filename = filename;
            this.contents = contents;
        }

        /// <summary>
        /// Gets the filename.
        /// </summary>
        public string Filename
        {
            get
            {
                return filename;
            }
        }

        /// <summary>
        /// Gets the contents.
        /// </summary>
        public string Contents
        {
            get
            {
                return contents;
            }
        }

        /// <summary>
        /// Checks if this object is equal to the given object.
        /// </summary>
        /// <param name="other"></param>
        /// <returns></returns>
        public bool Equals(FileDefinition other)
        {
            if (other == null)
            {
                return false;
            }

            return string.Equals(Filename, other.Filename) && string.Equals(Contents, other.Contents);
        }

        /// <summary>
        /// Checks if this object is equal to the given object.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public override bool Equals(object obj)
        {
            FileDefinition fileDefinition = obj as FileDefinition;
            return Equals(fileDefinition);
        }

        /// <summary>
        /// Gets the hash code for this object.
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            return filename.GetHashCode() * 13 + contents.GetHashCode();
        }

        /// <summary>
        /// Creates a text representation of this object.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return string.Format("FileDefinition(Filename: '{0}', Contents: '{1}')", filename, contents);
        }
    }
}