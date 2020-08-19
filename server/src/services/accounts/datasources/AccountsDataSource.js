import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import DataLoader from "dataloader";

import getToken from "../../../lib/getToken";

class AccountsDataSource extends DataSource {
  authorPermissions = [
    "read:own_account",
    "edit:own_account",
    "read:any_profile",
    "edit:own_profile",
    "read:any_content",
    "edit:own_content",
    "upload:own_media"
  ];

  moderatorPermissions = [
    "read:any_account",
    "block:any_account",
    "promote:any_account",
    "block:any_content"
  ];

  // Pass auth0 to the constructor and set it as a property; when we 
  // instantiate our data source later, we'll pass in our Auth0 configuration
  // so we have access to the Management API client.
  constructor({ auth0 }) {
    super();
    this.auth0 = auth0;
  }

  _accountByIdLoader = new DataLoader(async ids => {
    const q = ids.map(id => `user_id:${id}`).join("OR ");
    const accounts = await this.auth0.getUsers({ search_engine: "v3", q });

    return ids.map(id => accounts.find(account => account.user_id === id));
  })

  getAccountById(id) {
    return this._accountByIdLoader.load(id);
  }

  getAccounts() {
    return this.auth0.getUsers();
  }

  createAccount(email, password) {
    return this.auth0.createUser({
      app_metadata: {
        groups: [],
        roles: ["author"],
        permissions: this.authorPermissions
      },
      connection: "Username-Password-Authentication",
      email,
      password
    });
  }

  async changeAccountBlockedStatus(id) {
    // Toggle the "blocked" boolean from the current user's account
    const { blocked } = await this.auth0.getUser({ id });
    return this.auth0.updateUser({ id }, { blocked: !blocked });
  }

  async changeAccountModeratorRole(id) {
    const user = await this.auth0.getUser({ id });
    const isModerator = user.app_metadata.roles.includes("moderator");
    const roles = isModerator ? ["author"] : ["moderator"];
    const permissions = isModerator
      ? this.authorPermissions
      : this.authorPermissions.concat(this.moderatorPermissions);

    return this.auth0.updateUser(
      { id },
      {
        app_metadata: {
          groups: [],
          roles,
          permissions
        }
      }
    );
  }

  async deleteAccount(id) {
    await this.auth0.deleteUser({ id });
    return true;
  }

  async updateAccount(id, { email, newPassword, password }) {
    if (!email && !newPassword && !password) {
      throw new UserInputError(
        "You must supply some account data to update."
      );
    } else if (email && newPassword && password) {
      throw new UserInputError(
        "Email and password cannot be updated simultaneously."
      )
    } else if ((!password && newPassword) || (password && !newPassword)) {
      throw new UserInputError(
        "Provide the existing and new passwords when updating the password."
      );
    };

    // If no email was submitted, we know we're updating the password: 
    if (!email) {
      const user = await this.auth0.getUser({ id });
      await getToken(user.email, password);
      return this.auth0.updateUser({ id }, { password: newPassword });
    }
    // Otherwise, we know we have an email, 
    // so call Auth0's updateUser method to update the email
    return this.auth0.updateUser({ id }, { email });
  }
}

export default AccountsDataSource;
