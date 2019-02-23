import unittest
from version_ci_bot.pom import read_version


class PomTestCase(unittest.TestCase):
    def test_read_version(self):
        v = read_version('test/pom/pom.xml')
        self.assertEqual(v, '1.2.3')
