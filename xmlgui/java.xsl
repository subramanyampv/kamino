<?xml version="1.0" encoding="ISO-8859-7"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="text" omit-xml-declaration="yes" version="1.0" encoding="iso-8859-7"/>

<xsl:template match="form">
<![CDATA[
import javax.swing.*;

public class ]]><xsl:value-of select="@id"/><![CDATA[ extends JFrame {
	public ]]><xsl:value-of select="@id"/><![CDATA[() {
		super();
		setTitle("]]><xsl:value-of select="@caption"/><![CDATA[");
		pack();
		show();
	}

	public static void main(String[] params) {
		new  ]]><xsl:value-of select="@id"/><![CDATA[();
	}
}
]]>
</xsl:template>
</xsl:stylesheet>

