import { loadFiles, jasmine } from "./jasmine-test-runner.js";

let [ config, ...specFiles ] = process.argv.slice(2);
loadFiles(
    config,
    specFiles
).then(() => jasmine.execute()).catch( ex => console.log(ex));
