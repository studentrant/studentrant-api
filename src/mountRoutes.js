import express from 'express';

export default function mountRoutes(app, routes) {
  routes.forEach((Route) => {
    app.use(
      Route.API_PATH,
      new Route(express.Router(), app.get('CONFIGURATION')),
    );
  });
}
