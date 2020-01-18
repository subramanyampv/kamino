using IglooCastle.Core;
using IglooCastle.Samples;
using NUnit.Framework;
using System;

namespace IglooCastle.Tests
{
    [TestFixture]
    class HtmlPageTest
    {
        private HtmlPage htmlPage;

        [SetUp]
        public void SetUp()
        {
            Type type = typeof(Sample);
            htmlPage = new HtmlPage();
        }

        [Test]
        public void TestCreateHtmlPage()
        {
            string html = htmlPage.CreateHtmlPage(new PageModel
            {
                Title = "Some Method",
                Summary = "Creates something",
                Namespace = "Some.Namespace",
                Assembly = "Some.Assembly",
                Syntax = "public void SomeMethod()"
            });

            Assert.AreEqual(@"<div>
<h1>Some Method</h1>
<p>Creates something</p>
<p><strong>Namespace:</strong> Some.Namespace</p>
<p><strong>Assembly:</strong> Some.Assembly</p>
<p><code>public void SomeMethod()</code></p>
</div>", html);
        }
    }
}
