/**
 * Модуль для работы c API amoCRM
 * Модуль используется для работы в NodeJS.
 */

import axios, { AxiosResponse } from "axios";
import querystring from "querystring";
import fs from "fs";
import axiosRetry from "axios-retry";
import config from "./config";
import logger from "./logger";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const AMO_TOKEN_PATH = "amo_token.json";

const LIMIT = 200;	

interface Token {
	access_token: string;
	refresh_token: string;
  }
  
  interface Filters {
	[key: string]: any;
  }

class Api {
	public access_token: string | null = null;
    public refresh_token: string | null = null;
    public readonly ROOT_PATH: string = `https://${config.SUB_DOMAIN}.amocrm.ru`;
	

	public authChecker = (request: (...args: any[]) => Promise<any>): (...args: any[]) => Promise<any> => {
		return (...args: any[]): Promise<any> => {
			if (!this.access_token) {
				return this.getAccessToken().then(() => this.authChecker(request)(...args));
			}
			return request(...args).catch((err: any) => {
				logger.error(err.response);
				logger.error(err);
				logger.error(err.response.data);
				const data: any = err.response.data;
				if ("validation-errors" in data) {
					data["validation-errors"].forEach(({ errors }: { errors: any[] }) => logger.error(errors));
					logger.error("args", JSON.stringify(args, null, 2));
				}
				if (data.status === 401 && data.title === "Unauthorized") {
					logger.debug("Нужно обновить токен");
					return this.refreshToken().then(() => this.authChecker(request)(...args));
				}
				throw err;
			});
		};
	};

	public requestAccessToken = (): Promise<Token> => {
		return axios
			.post(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "authorization_code",
				code: config.AUTH_CODE,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res) => {
				logger.debug("Свежий токен получен");
				return res.data;
			})
			.catch((err) => {
				logger.error(err.response.data);
				throw err;
			});
	};

	public async getAccessToken(): Promise<any> {
		if (this.access_token) {
			return Promise.resolve(this.access_token);
		}
		try {
			const content = fs.readFileSync(AMO_TOKEN_PATH, 'utf-8');
			const token = JSON.parse(content);
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		} catch (error) {
			logger.error(`Ошибка при чтении файла ${AMO_TOKEN_PATH}`, error);
			logger.debug("Попытка заново получить токен");
			const token = await this.requestAccessToken();
			fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
			this.access_token = token.access_token;
			this.refresh_token = token.refresh_token;
			return Promise.resolve(token);
		}
	};

	public async refreshToken(): Promise<any> {
		return axios
			.post(`${this.ROOT_PATH}/oauth2/access_token`, {
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: "refresh_token",
				refresh_token: this.refresh_token,
				redirect_uri: config.REDIRECT_URI,
			})
			.then((res) => {
				logger.debug("Токен успешно обновлен");
				const token = res.data;
				fs.writeFileSync(AMO_TOKEN_PATH, JSON.stringify(token));
				this.access_token = token.access_token;
				this.refresh_token = token.refresh_token;
				return token;
			})
			.catch((err) => {
				logger.error("Не удалось обновить токен");
				logger.error(err.response.data);
			});
	};
	
	// Получить сделку по id
	public getDeal = this.authChecker((id: number, withParam: string[] = []): Promise<any> => {
		return axios
		  .get(
			`${this.ROOT_PATH}/api/v4/leads/${id}?${querystring.encode({
			  with: withParam.join(","),
			})}`,
			{
			  headers: {
				Authorization: `Bearer ${this.access_token}`,
			  },
			}
		  )
		  .then((res: AxiosResponse) => res.data);
	  });

	// Получить сделки по фильтрам
	public getDeals = this.authChecker(({ page = 1, limit = LIMIT, filters }: { page?: number; limit?: number; filters?: Filters }): Promise<any[]> => {
		const url: string = `${this.ROOT_PATH}/api/v4/leads?${querystring.stringify({
		  page,
		  limit,
		  with: ["contacts"],
		  ...filters,
		})}`;

		console.log(url)

		return axios
      		.get(url, {
        		headers: {
          			Authorization: `Bearer ${this.access_token}`,
        	},
      	})
      .then((res: AxiosResponse) => {
        return res.data ? res.data._embedded.leads : [];
      });
  });

	// Обновить сделки
	public updateDeals = this.authChecker((data: any): Promise<any> => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/leads`, [].concat(data), {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

	// Получить контакт по id
	public getContact = this.authChecker((id: number): Promise<any> => {
		return axios
		  .get(`${this.ROOT_PATH}/api/v4/contacts/${id}?${querystring.stringify({
			with: ["leads"]
		  })}`, {
			headers: {
			  Authorization: `Bearer ${this.access_token}`,
			},
		  })
		  .then((res: AxiosResponse) => res.data);
	  });

	// Обновить контакты
	public updateContacts = this.authChecker((data: any): Promise<any> => {
		return axios.patch(`${this.ROOT_PATH}/api/v4/contacts`, [].concat(data), {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});

	//Вывод задач
	public createTask = this.authChecker((data: any) => {
		return axios.post(`${this.ROOT_PATH}/api/v4/tasks`, [].concat(data), {
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		});
	});


	//Создание задачи
	public getTasks = this.authChecker(() => {
		return axios
		  .get(
			`${this.ROOT_PATH}/api/v4/tasks?[0].status`,
			{
			  headers: {
				Authorization: `Bearer ${this.access_token}`,
			  },
			}
		  )
	});


}

export default new Api();
