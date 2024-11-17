import { Client, Users, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.VITE_SHORT_NOTICE_API_KEYS);

  const databases = new Databases(client);


  try {
    log('Request method: ' + req.method);
    log('Request headers: ' + JSON.stringify(req.headers));
    log('Raw body: ' + req.body);
    log('Raw payload: ' + req.payload);


    const res = await databases.listDocuments(
      process.env.VITE_DATABASE,
      process.env.VITE_NOTICES_COLLECTION
    )

    const notices = res.documents;

    log(notices);

    const now = new Date();

    for (const notice of notices) {
      const expiresAt = new Date(notice.expiresAt);

      if (expiresAt <= now) {
        // Delete notice if it is expired
        await databases.deleteDocument(
          process.env.VITE_DATABASE,
          process.env.VITE_NOTICES_COLLECTION,
          notice.$id);
        console.log(`Deleted expired notice: ${notice.$id}`);
      }
    }
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users

  } catch (err) {
    console.error("Error deleting expired notices:", error);
  }

  // The req object contains the request data
  // if (req.path === "/ping") {
  // Use res object to respond with text(), json(), or binary()
  // Don't forget to return a response!
  // return res.text("Pong");
  // }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
