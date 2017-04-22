var fs = require('fs');

function exists(location) {
    return new Promise(function(resolve) {
        fs.stat(location, function(errorLocationDoesNotExist) {
            resolve(!errorLocationDoesNotExist);
        });
    });
}

module.exports = {
    exists: exists
};
