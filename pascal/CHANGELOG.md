# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Added `CHANGELOG.md`

### Changed

- WinTimer: Migrated to Lazarus. Lazarus is now in charge of generating the
  WinTimer.res file, salvaged icon and bitmap from old res file. Could not save
  dialog resources.
- WinTimer: Rewrote Windows-1253 Greek text to English.
- WinTimer: Clicking on the tray icon toggles the visibility of the window.

### Removed

- WinTimer: Removed about and configure dialogs.
- Removed per-project `.gitignore` files.

### Fixed

- WinTimer: correct calculation of window size, support uptimes longer than 99
  hours.

[Unreleased]:
  https://github.com/ngeor/pascal/compare/b052aadd758c1a4cec463377fde86f28d2a88f63...HEAD
