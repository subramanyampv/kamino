'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
	prompting: function() {
		var done = this.async();
		this.prompt({
			type: 'input',
			name: 'name',
			message: 'Your project name',
			default: this.appname // default to current folder name
		}, function (answers) {
			this.log(answers.name);
			done();
		}.bind(this));
	}
});

