export default function mountGlobalConfigurations(app, configs) {
    for ( let Class of configs ) {
        const configInstance = new Class();
        const configuration  = configInstance.configure();
        if ( configInstance.useMiddleware ) {
	    app.use(configuration);
        }
    }
}
