import { Git } from './git/git';
import { expect } from 'chai';
import { requireNoVersionsAtHead } from './validations';

describe('validations', () => {
  describe('requireNoVersionsAtHead', () => {
    const git: Git = {} as Git;

    it('should pluralize the message', () => {
      git.versionsAtHead = (): string[] => [
        '0.0.1',
        '0.0.2'
      ];
      expect(() => requireNoVersionsAtHead(git)).to.throw('The current commit is already tagged with versions 0.0.1, 0.0.2');
    });

    it('should not pluralize the message', () => {
      git.versionsAtHead = (): string[] => ['0.0.2'];
      expect(() => requireNoVersionsAtHead(git)).to.throw('The current commit is already tagged with version 0.0.2');
    });

    it('should not throw an error on empty array', () => {
      git.versionsAtHead = (): string[] => [];
      requireNoVersionsAtHead(git);
    });
  });
});
