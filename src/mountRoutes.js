import express from "express";
export default function mountRoutes(app,routes) {
    for ( let Route of routes ) {
	app.use(Route.API_PATH, new Route(express.Router()));
    }
}
