import { SpecReporter } from "jasmine-spec-reporter";

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter());
jasmine.getEnv().DEFAULT_TIMEOUT_INTERVAL = 50000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
