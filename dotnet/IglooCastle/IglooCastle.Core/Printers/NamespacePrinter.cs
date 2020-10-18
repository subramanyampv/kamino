using IglooCastle.Core.Elements;
using System;

namespace IglooCastle.Core.Printers
{
    internal sealed class NamespacePrinter : PrinterBase<NamespaceElement>
	{
		public NamespacePrinter(Documentation documentation) : base(documentation)
		{
		}

		public override string Print(NamespaceElement element, bool typeLinks = true)
		{
			return string.Format(
				"<a href=\"{0}\">{1}</a>",
				Documentation.FilenameProvider.Filename(element.Namespace),
				element.Namespace);
		}

		public override string Syntax(NamespaceElement element, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}

		public override string Signature(NamespaceElement element, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}
	}
}
