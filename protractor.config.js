const BrowserstackHelper = require('./test/scripts/browserstackHelper');

const hasBrowserstack = process.env.BS === 'true';
const browserstackHelper = BrowserstackHelper(hasBrowserstack);
let config = {}, configCommon = {};

configCommon = {
  'specs': ['**/todo-spec.js'],
  'framework': 'jasmine',
  'allScriptsTimeout': 32000,
  'jasmineNodeOpts': {
    'defaultTimeoutInterval': 60000,
    'showTiming': true
  },
  // useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    return browserstackHelper.beforeLaunch();
  },
  ngApimockOpts: {
    protractorVersion: 5
  },
  onPrepare: function () {
    browser.ignoreSynchronization = true;
    global.setProtractorToNg1Mode = function () {
      // browser.useAllAngular2AppRoots = false;
      browser.rootEl = 'body';
    };
  },

  afterLaunch: function () {
    return browserstackHelper.afterLaunch();
  }
};

if (hasBrowserstack) {
  console.log('Using browserstack');
  if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    console.log('[ERROR] BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY not set... =(');
    return;
  }
  config = {
    seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
    commonCapabilities: browserstackHelper.config,
    multiCapabilities: [
      {
        'os': 'Windows',
        'os_version': '10',
        'browserName': 'Chrome',
        'browser_version': '59.0',
        'resolution': '1366x768'
      }
    ]
  }
  config.multiCapabilities.forEach(function (caps) {
    for (var i in config.commonCapabilities) caps[i] = caps[i] || config.commonCapabilities[i];
  });

} else {
  console.log("Using local");
  config.capabilities = {
    'browserName': 'chrome',
    chromeOptions: {
      args: ["--headless", "--disable-gpu", "--window-size=800,600"]
    }
  }
}
exports.config = Object.assign({}, configCommon, config);
