import { dump } from "auth0-deploy-cli";

(() => {
  const config = {
    AUTH0_API_MAX_RETRIES: 10,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID_DEPLOY,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET_DEPLOY,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_EXPORT_IDENTIFIERS: false
  };

  dump({ 
    config,
    format: "yaml",
    output_folder: "src/scripts/auth0-deploy"
  })
    .then(() => {
      console.log("Tenant export was successful.");
    })
    .catch(error => {
      console.log("Error exporting tenant: ", error);
    });
})();
