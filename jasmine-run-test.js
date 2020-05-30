import glob from "glob";
import Jasmine from "jasmine";

const jasmine = new Jasmine();
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
    ).then(() => jasmine.execute());
});
