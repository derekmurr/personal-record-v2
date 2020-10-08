import getToken from "../lib/getToken";

(async () => {
  const [email, password] = process.argv.slice(2);
  const access_token = await getToken(email, password).catch(error => {
    console.log(error);
  });
  console.log(access_token);
})();

// To get a token for use in GraphQL Playground, run this from the server directory
// node -r dotenv/config -r esm src/scripts/authenticateUser.js validemail validpassword