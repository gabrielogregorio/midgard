require('dotenv').config();

export const CONFIG_FILE = process.env.CONFIG_FILE?.toString() || 'needs .env "CONFIG_FILE=yourConfig.json"';
export const PORT = process.env.PORT || '3333';
