import { Git } from './git';

export class DryRunGit extends Git {
  constructor(dir: string) {
    super(dir);
  }

  add(file): void {
    console.log(`Would have added file ${file} in dir ${this.dir}`);
  }

  commit(message): void {
    console.log(`Would have committed in dir ${this.dir} with message ${message}`);
  }

  tag(version): void {
    console.log(`Would have tagged version ${version} as tag v${version} in dir ${this.dir}`);
  }

  push(): void {
    console.log(`Would have pushed in dir ${this.dir}`);
  }
}
