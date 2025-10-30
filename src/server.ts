import { buildApp } from './app';
import connectDB from './client/database';

const port = Number(process.env.PORT ?? 4000);

async function start() {
  const app = buildApp();
  try {
    await connectDB();
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
