import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  OPENAI_KEY: get('OPENAI_KEY').required().asString(),
  OPENAI_ASSISTANT_ID: get('OPENAI_ASSISTANT_ID').required().asString(),
};
