import fetch from "node-fetch";

import cloudinary from "../config/cloudinary";

export function deleteUpload(url) {
  // To delete an image from cloudinary, we need to know its unique public 
  // ID, which consists of the images fodler path in our Cloudinary Media 
  // Library, followed by the name of the file without the extension. We 
  // haven't saved the public IDs of our images anywhere, but we have
  // saved their Cloudinary URLs as the "media" value in posts and replies.
  // We can parse the URL to extract the public ID for an image related to 
  // a piece of deleted content and then pass it into a method from the 
  // Cloudinary API to delete the image:
  const public_id = url
    .split("/")
    .slice(-3)
    .join("/")
    .split(".")[0];

  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      [public_id],
      { invalidate: true, type: "authenticated" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

export function deleteUserUploads(profileId) {
  // Because we've placed images in subdirectories based on the user's 
  // ID, we can use cloudiary.api.delete_resources_by_prefix to remove 
  // all media files uploaded by that user in one go.
  const prefix = `${process.env.NODE_ENV}/${profileId}`;
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources_by_prefix(
      prefix,
      { invalidate: true, type: "authenticated" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
}

export function deleteUserUploadsDir(profileId) {
  // Cloudinary requires a directory to be empty before it can be 
  // programatically deleted, so when a user deletes their profile, 
  // we have to first delete all their images, and then separately 
  // delete their directory. Also, they don't expose any methods in their
  // Node.js SDK to delete folders, so we have to make a DELETE request 
  // explicitly to the applicable API endpoint. We'll do this using 
  // node-fetch to make it simpler.
  return fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/folders/${process.env.NODE_ENV}/${profileId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}: ${process.env.CLOUDINARY_API_SECRET}`
        ).toString("base64")}`
      }
    }
  );
}

// Converts each upload stream into a buffer, then returns a new promise 
// containing the concatenated buffers when all of the data has been 
// consumed from the stream:
function onReadStream(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on("error", error => reject(error));
    stream.on("data", data => buffers.push(data));
    stream.on("end", () => {
      const contents = Buffer.concat(buffers);
      resolve(contents);
    });
  });
}

// Checks the variables sent with the mutation, looks for Upload
// promises to resolve, calls any resolved object's createReadStreams
// method, converts the file stream into a buffer, then adds the 
// buffer and the original filename and MIME type back to the
// variables object: 
export async function readNestedFileStreams(variables) {
  const varArr = Object.entries(variables || {});

  for (let i = 0; i < varArr.length; i++) {
    if (Boolean(varArr[i][1] && typeof varArr[i][1].then === "function")) {
      const {
        createReadStream,
        encoding,
        filename,
        mimetype
      } = await varArr[i][1];
      const readStream = createReadStream();
      const buffer = await onReadStream(readStream);
      variables[varArr[i][0]] = { buffer, encoding, filename, mimetype };
    }

    if (varArr[i][1] !== null && varArr[i][1].constructor.name === "Object") {
      await readNestedFileStreams(varArr[i][1]);
    }
  }
  return variables;
}

// Writes the avatar file buffer passed into the updateProfile method in 
// ProfilesDataSource to the Cloudinary uploader as a stream:
export function uploadStream(buffer, options) {

  // The cloudinary.uploader.upload_stream method returns a stream instead 
  // of a promise, so we wrap it in a promise of our own so we can use 
  // async/await when calling it in the updateProfile method.
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });
}

// The uploadStream function takes two paramaters. The options object 
// we hand off to Cloudinary's upload_stream method to configure options
// like the path of a subdirectory to save the uploaded image in the 
// Media Library; it also may contain any transformations to apply to 
// the image on upload. The buffer parameter is passed into the returned 
// stream's "end" method to write the buffer before closing the stream.
