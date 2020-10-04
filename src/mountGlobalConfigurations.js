export default function mountGlobalConfigurations(app, configs) {
  configs.forEach((Class) => {
    const configInstance = new Class(app.get('CONFIGURATION'));
    const configuration = configInstance.configure();
    if (configInstance.useMiddleware) {
      app.use(configuration);
    }
  });
}
