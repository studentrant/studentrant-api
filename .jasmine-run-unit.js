import glob from "glob";
import { loadFiles, jasmine } from "./jasmine-test-runner.js";

let [ config, specFiles ] = process.argv.slice(2);
console.log(specFiles);
loadFiles(
    config,
    glob.sync(specFiles)
).then(() => jasmine.execute()).catch( ex => console.log(ex));
