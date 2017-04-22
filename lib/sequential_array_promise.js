module.exports = function sequentialArrayPromise(array, promiseFactory) {
    var promise = Promise.resolve();
    var result = [];

    function collect(singleValue) {
        result.push(singleValue);
    }

    return array.reduce(function(acc, val) {
        return acc
            .then(() => promiseFactory(val))
            .then(collect);
    }, promise).then(() => result);
};
