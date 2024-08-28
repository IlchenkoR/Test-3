/**
 * Основной модуль приложения - точка входа. 
 */

import express, { Request, Response } from "express";
import api from './api'
import logger from './logger';
import config from './config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

api.getAccessToken().then(() => {
	app.get("/ping", (req: Request, res: Response) => res.send("pong " + Date.now()));

	app.get("/install", (req: Request, res: Response) => {
		console.log(req.body);
		res.send("OK");
	});

	app.listen(config.PORT, () => logger.debug("Server started on ", config.PORT));
});
