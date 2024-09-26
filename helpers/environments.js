const environments={};

environments.staging={
    port:3000,
    envName:'staging',
    secretKey:'secretKey1234',
    mongoURI:'mongodb://localhost:27017/node-rest-api-example',
    maxChecks:5
};


environments.production={
    port:5000,
    envName:'production',
    secretKey:'your_production_secret_key',
    mongoURI:'your_production_mongodb_uri',
    maxChecks:5
};

environments.development={
    port:6000,
    envName:'development',
    secretKey:'your_development_secret_key',
    mongoURI:'your_development_mongodb_uri',
    maxChecks:5
};

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports=environmentToExport;