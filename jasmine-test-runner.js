//import glob from "glob";
import Jasmine from "jasmine";
import jSpecReporter from "jasmine-spec-reporter";

export const jasmine = new Jasmine();

(function specReport() {
    const jasmineEnv = jasmine.jasmine.getEnv();
    jasmineEnv.clearReporters();
    jasmineEnv.addReporter(new jSpecReporter.SpecReporter());
    jasmineEnv.DEFAULT_TIMEOUT_INTERVAL = 50000;
    jasmineEnv.random = false;
    jasmine.requires.push("esm");
})();

export async function loadFiles(config,testFiles) {
    jasmine.loadConfigFile(config);
    for ( let file of testFiles ) {
	await import(file).catch(e => {
	    console.error("error loading " , file);
	    console.error(e);
	    process.exit(1);
	});
    }
}
