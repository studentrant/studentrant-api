import convict from "convict";

const SCHEMA = {

    externalApis: {},

    dbConnectionString: {

        connString     : { format : String, default: "" },
        extraArgument  : { format : String, default: "" },
        dbName         : { format : String, default: "" },
        replicaSetName : { format : String, default: "" },
        dbUser         : { format : String, default: "" },
        dbPass         : { format : String, default: "" },

        replOne  : {
	    host : { format : String, default: "" },
	    port : { format : Number, default: "" }
        },
        replTwo  : {
	    host : { format : String, default: "" },
	    port : { format : Number, default: "" }
        },
        replThree: {
	    host : { format: String, default: "" },
	    port : { format: Number, default: "" }
        }
    },

    env : {
        format  : [ "prod", "dev", "test" ],
        arg     : "env",
        default : "",
        env     : "NODE_ENV"
    },

    sessionSecret : { format : String, default: "" },

    sendGrid: {
        apiKey      : { format : String, default: "" },
        templateIds : {
	    emailVerification: { format: String, default: "" }
        }
    },
    SERVER: {
        HOST: { format  : String, default: "" },
        PORT: { format  : Number, default: "" }
    }
};

function setDbConnString() {

    const config  = convict(SCHEMA).validate({ allowed: "strict" });

    config.loadFile(
        `./.${config.get("env")}.json`
    );

    const [ nodeOne, nodeTwo, nodeThree ] =
	  [
	      `${config.get("dbConnectionString.replOne.host")}:${config.get("dbConnectionString.replOne.port")}`,
	      `${config.get("dbConnectionString.replTwo.host")}:${config.get("dbConnectionString.replTwo.port")}`,
	      `${config.get("dbConnectionString.replThree.host")}:${config.get("dbConnectionString.replThree.port")}`,
	  ];

    const DBAUTH = `${config.get("dbConnectionString.dbUser")}:${config.get("dbConnectionString.dbPass")}`;
    const URL    = `${nodeOne},${nodeTwo},${nodeThree}/${config.get("dbConnectionString.dbName")}`;
    const QUERY  = `${config.get("dbConnectionString.extraArgument")}&replicaSet=${config.get("dbConnectionString.replicaSetName")}`;

    if ( config.get("env") === "test" )
        config.set( "dbConnectionString.connString", `mongodb://${URL}?${QUERY}` );
    else
        config.set( "dbConnectionString.connString", `mongodb://${DBAUTH}@${URL}?${QUERY}` );

    return config;
}

export const config = setDbConnString();
