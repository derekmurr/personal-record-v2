import update from "immutability-helper";

import { GET_PROFILE_CONTENT, SEARCH_PROFILES } from "../graphql/queries";

// Paginate a post directly:
export function updateFieldPageResults(
  field,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field];

  return newEdges.length
    ? {
      [field]: {
        __typename: previousResult[field].__typename,
        edges: [...previousResult[field].edges, ...newEdges],
        pageInfo
      }
    }
    : previousResult;
}

// Updates the Apollo Client cache for posts and replies when the user
// changes their profile (username, fullName, avatar) so we don't have to
// re-fetch all that (potentially paginated) content from the server
export function updateProfileRunUser(
  cache,
  username,
  updatedUser
) {
  // Use the username to get the appropriate stale content from the store
  let { profile } = cache.readQuery({
    query: GET_PROFILE_CONTENT,
    variables: { username }
  });
  // Map over the run edges and replace the user field for each item
  const updatedRunsEdges = profile.runs.edges.map(edge =>
    update(edge, {
      node: { user: { $set: { ...edge.node.user, ...updatedUser } } }
    })
  );

  // Update the store with the new profile, runs, and edges
  cache.writeQuery({
    query: GET_PROFILE_CONTENT,
    data: {
      profile: {
        ...profile,
        runs: { ...profile.runs, edges: updatedRunsEdges }
      }
    }
  });
}


// Updates the Apollo Cache for items in a profile search query
export function updateSearchProfilesFollowing(cache, followingId, text) {
  let { searchProfiles } = cache.readQuery({
    query: SEARCH_PROFILES,
    variables: { query: { text } }
  });
  const followingIndex = searchProfiles.edges.findIndex(
    item => item.node.id === followingId
  );
  const isFollowing =
    searchProfiles.edges[followingIndex].node.viewerIsFollowing;
  const updatedSearchProfiles = update(searchProfiles, {
    edges: {
      [followingIndex]: {
        node: { viewerIsFollowing: { $set: !isFollowing } }
      }
    }
  });

  cache.writeQuery({
    query: SEARCH_PROFILES,
    data: { searchProfiles: updatedSearchProfiles }
  });
}

// Paginate a field nested in a query: 
export function updateSubfieldPageResults(
  field,
  subfield,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];

  return newEdges.length
    ? {
      [field]: {
        ...previousResult[field],
        [subfield]: {
          __typename: previousResult[field][subfield].__typename,
          edges: [...previousResult[field][subfield].edges, ...newEdges],
          pageInfo
        }
      }
    }
    : previousResult;
}
