const JasmineSpecReporter = require("jasmine-spec-reporter").SpecReporter;

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new JasmineSpecReporter());
jasmine.getEnv().DEFAULT_TIMEOUT_INTERVAL = 50000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
