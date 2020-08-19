import { redisSMQ } from "../../config/redis";
import {
  deleteUserUploads,
  deleteUserUploadsDir
} from "../../lib/handleUploads";
import Queue from "../../lib/Queue";
import Run from "../../models/Run";

export async function initDeleteProfileQueue() {
  const deleteProfileQueue = new Queue(redisSMQ, "profile_deleted");
  await deleteProfileQueue.createQueue();
  return deleteProfileQueue;
}

export async function onDeleteProfile(payload) {
  const { userProfileId } = JSON.parse(payload.message);
  await Run.deleteMany({ userProfileId }).exec();
  await deleteUserUploads(userProfileId);
  await deleteUserUploadsDir(userProfileId);
}
