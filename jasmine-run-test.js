import glob from "glob";
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

glob("./__test__/*.mjs", async (err,files)=> {
    Promise.all(
	files.map( f => {
	    return import(f)
		.catch(e => {
		    console.error("error loading " , f);
		    console.error(e);
		    process.exit(1);
		});
	})
    ).then(() => jasmine.execute()).catch(ex => console.log(ex));
});
