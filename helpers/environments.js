/*
*Title: Environments
*Description: Handle all environment related things
*Author: Anisur Rahman (Learn with Anis)
*Date:19/12/24
*
*/

//Dependencies

//module scaffolding

const environments = {};

//staging (default) environment variables

environments.staging = {
  port: 3000,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  maxChecks: 5,
  expiresIn: 1 * 60 * 60 * 1000, // 1 hour
  secretKey: 'stagingKey',
};

//production environment variables

environments.production = {
  port: 5000,
  envName: 'production',
  hashingSecret: 'thisIsAlsoASecret',
  maxChecks: 5,
  expiresIn: 1 * 60 * 60 * 1000, // 1 hour
  secretKey: 'productionKey',
};

//determine which environment to use

// eslint-disable-next-line no-undef
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV:'staging';

const environmentToExport = typeof(environments[currentEnvironment])==='object'?environments[currentEnvironment]:environments.staging;

module.exports = environmentToExport;

// End of code
//----------------------------------------------------------------powered by the Anisur Rahman