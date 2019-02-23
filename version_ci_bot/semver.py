class SemVer:
    def __init__(self, major, minor, patch):
        self.major = major
        self.minor = minor
        self.patch = patch

    @staticmethod
    def parse(version):
        parts = [int(x) for x in version.split('.')]
        return SemVer(parts[0], parts[1], parts[2])

    def __repr__(self):
        return f'SemVer {self.major}.{self.minor}.{self.patch}'

    def __str__(self):
        return f'{self.major}.{self.minor}.{self.patch}'

    def __eq__(self, other):
        return self.major == other.major and self.minor == other.minor and self.patch == other.patch

    def __hash__(self):
        return hash((self.major, self.minor, self.patch))

    def bump_major(self):
        return SemVer(1 + self.major, 0, 0)

    def bump_minor(self):
        return SemVer(self.major, 1 + self.minor, 0)

    def bump_patch(self):
        return SemVer(self.major, self.minor, 1 + self.patch)

    def ensure_can_bump_to(self, other):
        '''
        Ensures that it is possible to jump from the current version to the given one,
        without leaving gaps in the SemVer sequence.
        '''
        if not other in [self.bump_major(), self.bump_minor(), self.bump_patch()]:
            raise ValueError(f'It is not possible to bump {self} to {other}')
