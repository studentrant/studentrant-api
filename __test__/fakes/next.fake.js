// eslint-disable-next-line
import { res } from "./res.fake.js";
export function next(value) {
    if ( value ) {
        if ( value.errorDetails ) return value.errorDetails;
    }
    return false;
}
