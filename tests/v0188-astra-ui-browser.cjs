'use strict';
// Run the real-browser half as a required test in the existing v0.188 runner.
require('node:child_process').execFileSync(process.execPath,['tests/v0188-astra-ui-locale.cjs','--browser'],{stdio:'inherit'});
