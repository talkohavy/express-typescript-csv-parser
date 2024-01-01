import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToEnvFile = path.resolve(__dirname, '../../../../../.env');

console.log('##################################');
console.log('##################################');
console.log('##################################');
console.log('##################################');
console.log('pathToEnvFile:', pathToEnvFile);
console.log('##################################');
console.log('##################################');
console.log('##################################');
console.log('##################################');

dotenv.config({ path: pathToEnvFile });
