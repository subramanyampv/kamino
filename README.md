# dotfiles
dotfiles and small scripts

## Installation on Windows

- Clone the repository
- Open a Command Prompt as Administrator
- From the repository folder, run `install.cmd up`
- To uninstall, run `install.cmd down`

### Git aliases

Include this in your own `.gitconfig` by using the `[include]` directive with the path to this file

```
[include]
    path = ~/.gitconfig_include
```

If you don't have any existing includes, you can add this via the following command

```
git config --global include.path ~/.gitconfig_include
```

### PowerShell aliases

Add this line to `$Home\Documents\WindowsPowerShell\Profile.ps1`:

```
. "path-to-the-repository\aliases.ps1"
```
