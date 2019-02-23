import unittest
from version_ci_bot.semver import SemVer


class SemVerTestCase(unittest.TestCase):
    def test_create(self):
        v = SemVer(1, 2, 3)
        self.assertEqual(1, v.major)
        self.assertEqual(2, v.minor)
        self.assertEqual(3, v.patch)

    def test_parse(self):
        v = SemVer.parse('1.2.13')
        self.assertEqual(1, v.major)
        self.assertEqual(2, v.minor)
        self.assertEqual(13, v.patch)

    def test_format(self):
        v = SemVer.parse('11.13.17')
        self.assertEqual('11.13.17', f'{v}')

    def test_equals(self):
        v1 = SemVer.parse('1.0.1')
        v2 = SemVer.parse('1.0.1')
        self.assertEqual(v1, v2)

    def test_not_equals_different_major(self):
        v1 = SemVer.parse('1.0.1')
        v2 = SemVer.parse('2.0.1')
        self.assertNotEqual(v1, v2)

    def test_not_equals_different_minor(self):
        v1 = SemVer.parse('1.0.1')
        v2 = SemVer.parse('1.3.1')
        self.assertNotEqual(v1, v2)

    def test_not_equals_different_patch(self):
        v1 = SemVer.parse('1.0.1')
        v2 = SemVer.parse('1.0.0')
        self.assertNotEqual(v1, v2)

    def test_bump_major(self):
        self.assertEqual(SemVer.parse('1.2.3').bump_major(),
                         SemVer.parse('2.0.0'))

    def test_bump_minor(self):
        self.assertEqual(SemVer.parse('1.2.3').bump_minor(),
                         SemVer.parse('1.3.0'))

    def test_bump_patch(self):
        self.assertEqual(SemVer.parse('1.2.3').bump_patch(),
                         SemVer.parse('1.2.4'))

    def test_ensure_can_bump_to(self):
        v = SemVer.parse('1.2.3')

        with self.subTest('bump patch'):
            self.assertIsNone(v.ensure_can_bump_to(SemVer.parse('1.2.4')))

        with self.subTest('bump minor'):
            self.assertIsNone(v.ensure_can_bump_to(SemVer.parse('1.3.0')))

        with self.subTest('bump major'):
            self.assertIsNone(v.ensure_can_bump_to(SemVer.parse('2.0.0')))

        with self.subTest('no bump'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(v)

        with self.subTest('bump patch skipping one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('1.2.5'))

        with self.subTest('bump patch going back one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('1.2.1'))

        with self.subTest('bump minor skipping one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('1.4.0'))

        with self.subTest('bump minor going back one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('1.1.0'))

        with self.subTest('bump minor not reseting patch to zero'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('1.3.3'))

        with self.subTest('bump major skipping one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('3.0.0'))

        with self.subTest('bump major going back one'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('0.0.0'))

        with self.subTest('bump major not reseting patch to zero'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('2.0.3'))

        with self.subTest('bump major not reseting minor to zero'):
            with self.assertRaises(ValueError):
                v.ensure_can_bump_to(SemVer.parse('2.2.0'))
