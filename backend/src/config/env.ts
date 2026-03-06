import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key: string): string | number => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required enviroment variable: ${key}`);
  }
  return value;
};

export const env = {
  CONFIG_MTU: requireEnv('CONFIG_MTU'),
  CONFIG_MSS: requireEnv('CONFIG_MSS'),
  IP_HEADER_SIZE: requireEnv('IP_HEADER_SIZE'),
};
