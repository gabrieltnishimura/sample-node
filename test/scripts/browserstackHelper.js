const browserstack = require('browserstack-local');

const config = {
    'browserstack.local': true,
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.debug': 'true',
    'build': 'std-portal-comercial-web',
    'name': 'Testing Portal',
    'logFile': './browserstack.log'
};

module.exports = function (isBuild) {
    let bs_local;
    return {
        config: config,
        beforeLaunch: () => {
            if (!isBuild) {
                return;
            }
            return new Promise(function (resolve, reject) {
                bs_local = new browserstack.Local();
                bs_local.start({
                    'key': config['browserstack.key'],
                    'logFile': './../../browserstack.log'
                }, function (error) {
                    if (error) return reject(error);
                    console.log('Connected. Now testing...');
                    resolve();
                });
            });
        },
        afterLaunch: () => {
            if (!isBuild) {
                return;
            }
            if (!bs_local) {
                throw ('bs_local not defined');
            }
            return new Promise(function (resolve, reject) {
                bs_local.stop(resolve);
            });
        }
    }
}
