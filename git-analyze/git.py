import datetime
import subprocess


class Git:
    def rev_list(self, since, until, reverse=False):
        str_reverse = ' --reverse' if reverse else ''
        result = subprocess.run(
            f'git rev-list --since={since} --until={until}{str_reverse} master',
            check=True,
            cwd=None,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )

        return result.stdout

    def commit_date(self, commit_id):
        result = subprocess.run(
            f'git show -s --format=%ci {commit_id}',
            check=True,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )

        # the result looks like 2017-02-20 21:28:35 +0100
        return datetime.datetime.strptime(result.stdout.split(' ')[0], '%Y-%m-%d').date()

    def checkout(self, commit_id):
        subprocess.run(
            f'git checkout -q {commit_id}',
            check=True,
            encoding='utf-8',
            stdout=subprocess.PIPE
        )
