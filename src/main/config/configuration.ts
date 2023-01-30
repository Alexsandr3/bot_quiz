import { config } from 'dotenv';

config();
import * as process from 'process';



export const getConfiguration = () => ({
  PORT: parseInt(process.env.PORT, 10),
  CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  tokens: {
    TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,
  },
  database: {
    PGSQL_ELEPHANT_URI: process.env.PGSQL_ELEPHANT_URI
  }
});

export type ConfigType = ReturnType<typeof getConfiguration>;
