const spwan = require('child_process').spawn;
const npmCommand = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

let childs = {};
childs.server = runAppServer(canRunTestE2E);

let _serversRun = 0;

function canRunTestE2E() {
    _serversRun++;
    if (_serversRun === Object.keys(childs).length) {
        childs.E2E = runTestE2E();
    }
}

function killAll(killedBy, codeResult) {
    console.log(`Killed by: ${killedBy}, with code: ${codeResult}`);
    process.exit(codeResult);
}

function runAppServer(onDone) {
    let process_run = spwan('node', ['test/scripts/app.js']);
    process_run.stdout.on('data', (data) => {
        if (data.toString().startsWith('Server started')) {
            if (typeof onDone === 'function') {
                onDone();
            }
        }
    });
    registerProcessEvents(process_run, 'app.js');
    return process_run;
}

function runTestE2E() {
    process.env.E2E_PORT = process.env.E2E_PORT || 8080;
    let process_run = spwan(npmCommand, ['run', 'test:e2e']);
    registerProcessEvents(process_run, 'protractor');
    return process_run;
}

function registerProcessEvents(process_run, name) {
    process_run.stdout.on('data', (data) => {
        console.log(`${name} stdout: ${data}`);
    });
    process_run.stderr.on('data', (data) => {
        console.log(`${name} stderr: ${data}`);
    });
    process_run.on('exit', (codeResult) => killAll(name, codeResult));
}