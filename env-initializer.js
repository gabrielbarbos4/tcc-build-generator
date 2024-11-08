const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const dotenv = require('dotenv').config({path: 'src/.env'}); ;

const envFile = `export const environment = {
    VERCEL_PROJECT_PRODUCTION_URL: '${process.env.VERCEL_PROJECT_PRODUCTION_URL}',
};
`;

const targetPath = path.join(__dirname, './src/env/environment.prod.ts');

fs.writeFile(targetPath, envFile, (err) => {
  console.log(envFile)
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment.development.ts`);
  }
});
