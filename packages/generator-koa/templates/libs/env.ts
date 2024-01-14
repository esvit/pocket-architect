import { keyblade } from 'keyblade';
import yenv from 'yenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
export const isProdEnv = process.env.NODE_ENV === 'production';
export const isTestEnv = process.env.NODE_ENV === 'test';

const env = keyblade(yenv(), {
  message: (key) => `[yenv] ${key} not found in the loaded environment`,
  ignore: []
  // logBeforeThrow: (message) => console.error(message)
});

export default
function (name) {
  return env[name];
}
