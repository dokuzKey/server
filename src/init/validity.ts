import config from '../../config';
import dotenv from 'dotenv';
import connectDB from '../modules/database/connect';
dotenv.config();

export default function bootCheck() {
  console.log('🔍 Checking the configuration values...');

  // Check port configuration
  if (
    !config.port ||
    typeof config.port !== 'number' ||
    config.port < 1 ||
    config.port > 65535
  ) {
    throw new Error(
      'The port value is not defined in the configuration file or is invalid! Please add it to the config.ts file.'
    );
  }

  // Check site address configuration
  if (!config.siteAddress || typeof config.siteAddress !== 'string') {
    throw new Error(
      'The siteAdress value is not defined in the configuration file or is invalid! Please add it to the config.ts file.'
    );
  }

  // Check the MongoDB URI configuration
  if (!process.env.MONGO_URI || typeof process.env.MONGO_URI !== 'string') {
    throw new Error(
      'MONGO_URI is not defined in the environment variables! Please add it to the .env file.'
    );
  }

  // Check the JWT key configuration
  if (!process.env.JWT_KEY) {
    throw new Error(
      'JWT_KEY is not defined in the environment variables! Please add it to the .env file.'
    );
  }

  console.log(
    '✅ Verified config value validity! Continuing start-up process...'
  );

  connectDB();
}
