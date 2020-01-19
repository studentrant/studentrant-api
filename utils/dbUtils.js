"use strict";

module.exports = class DbUtils {

    static async ResourceExists(coll = [], resource ) {

	coll                      = Array.isArray(coll) ? coll : [ coll ];
	const [ [ key , value ] ] = Object.entries(resource);

	try {

	    for ( let col of coll ) {
		const val = await col.findOne({ [key]: value });
		if ( val ) return {
		    collection: col,
		    exists    : true,
		    error     : false,
		    data      : val
		};
	    }

	    return {
		error  : false,
		exists : false
	    };

	} catch(ex) {
	    return {
		ex,
		error : true,
		exists: false
	    };
	}
    }
};
