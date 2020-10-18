<%@ Page Language="C#" Inherits="CVRender.Web.Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head runat="server">
	<title>Default</title>
</head>
<body>
	<form id="form1" runat="server">
		<img src="CVRenderer.ashx" alt="" usemap="#cvmap" border="0" />
		<map name="cvmap">
			<area shape="rect" coords="5,5,10,10" href="Default.aspx" alt="block 1" />
		</map>
		<asp:Button id="button1" runat="server" Text="Click me!" OnClick="button1Clicked" />
	</form>
</body>
</html>