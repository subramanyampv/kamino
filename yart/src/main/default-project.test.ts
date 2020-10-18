import { Git } from './git/git';
import { NextSemVer } from './next-semver';
import { SemVer } from './semver';
import { expect } from 'chai';
import { handleDefaultProject } from './default-project';

describe('default-project', () => {
  const git: Git = {} as Git;
  const currentGitVersion: SemVer = new SemVer('1.2.3');
  const nextSemVer: NextSemVer = new NextSemVer('1.2.4');

  it('should not tag on develop branch', () => {
    git.currentBranch = (): string => 'develop';
    expect(() => handleDefaultProject(currentGitVersion, git, nextSemVer))
      .to.throw('Only the master branch can be tagged');
  });

  it('should not tag if the current commit is versioned', () => {
    git.currentBranch = (): string => 'master';
    git.versionsAtHead = (): string[] => ['1.2.3'];
    expect(() => handleDefaultProject(currentGitVersion, git, nextSemVer))
      .to.throw('The current commit is already tagged with version 1.2.3');
  });

  it('should require a next version to be provided', () => {
    git.currentBranch = (): string => 'master';
    git.versionsAtHead = (): string[] => [];
    expect(() => handleDefaultProject(currentGitVersion, git, new NextSemVer('')))
      .to.throw('Please specify the version with -v');
  });

  it('should tag the new version', () => {
    const tags = [];
    git.currentBranch = (): string => 'master';
    git.versionsAtHead = (): string[] => [];
    git.tag = (tag): void => {
      tags.push(tag)
    };

    // Act
    handleDefaultProject(currentGitVersion, git, nextSemVer);

    // Assert
    expect(tags).to.eql(['1.2.4']);
  });
});
