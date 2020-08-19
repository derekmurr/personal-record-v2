import { and, rule, shield } from "graphql-shield";

import getPermissions from "../../lib/getPermissions";

const canReadAnyRun = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("read:any_content");
});

const canEditOwnRun = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("edit:own_content");
});

const canBlockAnyRun = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("block:any_content");
});

const isCreatingOwnRun = rule()(
  // To verify that a user is trying to create their own content, we must
  // check the Auth0 ID in their profile against the ID of the current
  // authenticated user. To do that, we get the userProfileId value from
  // the mutation arguments and use it to fetch the associated user profile.
  // We have access to the Profile model via context b/c it's available as
  // a property set on the RunDataSource object, and we can call
  // Mongoose's findById method directly on it.
  async (parent, { data: { username } }, { user, dataSources }, info) => {
    const profile = await dataSources.runAPI.Profile.findOne({
      username
    }).exec();

    if (!profile || !user || !user.sub) {
      return false;
    }
    // Once we have the profile object, make sure its accountId object is 
    // equal to the ID of the authenticated user.
    return user.sub === profile.accountId;
  }
);

const isEditingOwnRun = rule()(
  // To verify the user is trying to delete their own run, we must
  // get their profile using the accountId field to query the document, then
  // retrieve the run from their respective collections to match
  // the _id field of the profile to the userProfileId field of the run
  // to be deleted.
  async (parent, { where: { id } }, { user, dataSources }, info) => {
    if (!user || !user.sub) {
      return false;
    }

    const profile = await dataSources.runAPI.Profile.findOne({
      accountId: user.sub
    }).exec();
    const run = await dataSources.runAPI.Run.findById(id);

    if (!profile || !run) {
      return false;
    }

    // Because the _id fields for the retrieved profile, post and reply are
    // MongoDB Object IDs, we must cast them to strings to compare equality.
    return profile._id.toString() === run.userProfileId.toString();
  }
);

// Implement our rules in the middleware:
const permissions = shield(
  {
    Query: {
      run: canReadAnyRun,
      runs: canReadAnyRun,
      searchRuns: canReadAnyRun
    },
    Mutation: {
      createRun: and(canEditOwnRun, isCreatingOwnRun),
      deleteRun: and(canEditOwnRun, isEditingOwnRun),
      updateRun: and(canEditOwnRun, isEditingOwnRun),
      toggleRunBlock: canBlockAnyRun
    }
  },
  { debug: process.env.NODE_ENV === "development" }
);

export default permissions;
