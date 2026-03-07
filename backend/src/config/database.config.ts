import { registerAs } from '@nestjs/config';

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432', 10),
    username: parsed.username,
    password: parsed.password,
    name: parsed.pathname.slice(1), // Remove leading /
  };
}

export const databaseConfig = registerAs('database', () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    return parseDatabaseUrl(databaseUrl);
  }
  
  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'pingchat',
  };
});
