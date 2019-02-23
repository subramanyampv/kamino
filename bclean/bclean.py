import subprocess


def should_delete_branch(branch):
    '''
    Checks if the given branch should be deleted.
    '''
    return branch and branch != 'master' and not branch.startswith('*')


def strip_lines(lines):
    return [line.strip() for line in lines]


def delete_branch(branch):
    subprocess.run(['git', 'branch', '-D', branch], check=True)


def get_branches():
    result = subprocess.run(
        ['git', 'branch', '-l'],
        check=True, stdout=subprocess.PIPE, encoding='utf8'
    )
    return [
        line for line in strip_lines(result.stdout.splitlines())
        if should_delete_branch(line)
    ]


def main():
    for branch in get_branches():
        delete_branch(branch)


if __name__ == "__main__":
    main()
