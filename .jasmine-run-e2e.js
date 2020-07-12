import glob from "glob";
import { loadFiles, jasmine } from "./jasmine-test-runner.js";

let [ config, specFiles] = process.argv.slice(2);

console.log(specFiles);
specFiles = glob.sync(specFiles);
specFiles.unshift("./__test__/index.test.mjs");

loadFiles(
    config,
    specFiles
).then(() => jasmine.execute()).catch( ex => console.log(ex));
