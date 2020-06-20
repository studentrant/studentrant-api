//import glob from "glob";
import Jasmine from "jasmine";
import jSpecReporter from "jasmine-spec-reporter";

const jasmine = new Jasmine();

function specReport() {
    jasmine.jasmine.getEnv().clearReporters();
    jasmine.jasmine.getEnv().addReporter(new jSpecReporter.SpecReporter());
    jasmine.jasmine.getEnv().DEFAULT_TIMEOUT_INTERVAL = 50000;
    jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
}

specReport();

jasmine.requires.push("esm");
jasmine.loadConfigFile("./jasmine.json");



const testFiles = [
    "./__test__/register.test.mjs",
    "./__test__/login.test.mjs",
    "./__test__/postrant.test.mjs"
];

async function loadFiles() {
    for ( let file of testFiles ) {
	await import(file).catch(e => {
	    console.error("error loading " , file);
	    console.error(e);
	    process.exit(1);
	});
    }
}

loadFiles().then(() => jasmine.execute()).catch( ex => console.log(ex));
