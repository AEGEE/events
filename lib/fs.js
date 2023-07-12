const rimraf = require('rimraf');

const rimrafPromisified = (file) => new Promise((resolve, reject) => {
    rimraf(file, (err) => {
        /* istanbul ignore if */
        if (err) {
            return reject(err);
        }

        return resolve();
    });
});

module.exports = {
    rimraf: rimrafPromisified
};
