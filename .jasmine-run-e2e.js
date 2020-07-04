import * as fs from "fs";
import { loadFiles, jasmine } from "./jasmine-test-runner.js";


loadFiles(
    "./.jasmine.e2e.json",
    fs.readdirSync().filter
).then(() => jasmine.execute()).catch( ex => console.log(ex));
