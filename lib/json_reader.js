var Promise = require('promise');
var fs = require('fs');

module.exports = function jsonReader(filename) {
    var promise = new Promise(function(fullfill, reject) {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) {
                reject(err);
                return;
            }

            fullfill(JSON.parse(data));
        });
    });

    return promise;
};
