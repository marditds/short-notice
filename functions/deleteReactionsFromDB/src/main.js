import { Client, Query, Databases } from 'node-appwrite';

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
      process.env.VITE_REACTIONS_COLLECTION
    )

    const reactions = res.documents;

    log(reactions);

    const now = new Date();

    log('now:', now);

    for (const reaction of reactions) {

      const expiresAt = new Date(reaction.expiresAt);

      if (reaction.expiresAt !== null) {
        log('reaction.expiresAt:', reaction.expiresAt)
        if (expiresAt <= now) {

          const [likesRes, savesRes] = await Promise.all([
            databases.listDocuments(
              process.env.VITE_DATABASE,
              process.env.VITE_LIKES_COLLECTION,
              [Query.equal('notice_id', reaction.notice_id)]
            ),
            databases.listDocuments(
              process.env.VITE_DATABASE,
              process.env.VITE_SAVES_COLLECTION,
              [Query.equal('notice_id', reaction.notice_id)]
            )
          ]);

          const likes = likesRes.documents;
          const saves = savesRes.documents;

          await Promise.allSettled([
            ...likes.map((like) =>
              databases.deleteDocument(
                process.env.VITE_DATABASE,
                process.env.VITE_LIKES_COLLECTION,
                like.$id
              )
            ),

            ...saves.map((save) =>
              databases.deleteDocument(
                process.env.VITE_DATABASE,
                process.env.VITE_SAVES_COLLECTION,
                save.$id
              )
            )
          ]);

          log('FOUND AN EXPIRED REACTION!', reaction.content);
          await databases.deleteDocument(
            process.env.VITE_DATABASE,
            process.env.VITE_REACTIONS_COLLECTION,
            reaction.$id);
          log(`Deleted expired reaction: ${reaction.$id}`);
        }

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
