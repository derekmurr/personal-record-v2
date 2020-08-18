export default function (user) {
  if (user && user["https://personalrecord.ca/user_authorization"]) {
    return user["https://personalrecord.ca/user_authorization"].permissions;
  }
  return false;
}
