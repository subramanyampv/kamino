import { Given } from 'cucumber';
import fs = require('fs');
import os = require('os');
import path = require('path');
import { updateXml } from '../../../main/xml/update-xml';

Given('a temporary directory', function () {
  this.tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
});

Given('a git repo', function () {
  this.tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
  this.git.init();
});

Given('a text file', function () {
  fs.writeFileSync(
    path.join(this.tempDirectory, 'hello.txt'),
    'hello, world!',
    'utf8'
  );
});

Given('a text file with contents {string}', function (contents) {
  fs.writeFileSync(
    path.join(this.tempDirectory, 'hello.txt'),
    contents,
    'utf8'
  );
});

Given('a text file is committed', function () {
  fs.writeFileSync(
    path.join(this.tempDirectory, 'hello.txt'),
    'hello, world!',
    'utf8'
  );
  this.git.add('hello.txt');
  this.commit('Adding hello.txt');
});

Given(
  'the file {string} with version {string} is committed',
  async function (filePath, version) {
    this.copy(filePath);
    await updateXml(
      fs,
      path.join(this.tempDirectory, 'pom.xml'),
      { project: { version } }
    );
    this.git.add('pom.xml');
    this.commit('initial version');
  }
);

Given('the file {string} is copied and added', function (filePath) {
  this.copy(filePath);
  this.git.add(filePath.split('/', 2)[1]);
});

Given(
  'the file {string} is committed as {string}',
  function (filePath, newFileName) {
    this.copy(filePath, newFileName);
    this.git.add(newFileName);
    this.commit('initial version');
  }
);

Given('the file is staged', function () {
  this.git.add('hello.txt');
});

Given('changes are committed', function () {
  this.commit('Adding hello.txt');
});

Given('changes are committed with message {string}', function (message) {
  this.commit(message);
});

Given('the commit is tagged with {string}', function (version) {
  this.git.tag(version);
});

Given('a new branch named {string} is checked out', function (name) {
  this.git.checkoutNew(name);
});
