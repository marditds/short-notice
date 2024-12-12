import { Client, Databases, Query } from 'node-appwrite';

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
    // log('Request method: ' + req.method);
    // log('Request headers: ' + JSON.stringify(req.headers));
    log('Raw body: ' + req.body);
    // log('Raw payload: ' + req.payload);


    const ntcs = await databases.listDocuments(
      process.env.VITE_DATABASE,
      process.env.VITE_NOTICES_COLLECTION
    )

    const notices = ntcs.documents;

    log(notices);

    const now = new Date();

    for (const notice of notices) {

      if (!notice.expiresAt || isNaN(new Date(notice.expiresAt))) {
        log(`Skipping notice with invalid expiresAt: ${notice.$id}`);
        continue;
      }

      const expiresAt = new Date(notice.expiresAt);

      if (expiresAt <= now) {

        await databases.deleteDocument(
          process.env.VITE_DATABASE,
          process.env.VITE_NOTICES_COLLECTION,
          notice.$id);
        log(`Deleted expired notice: ${notice.$id}`);

        // const [likesRes, savesRes] = await Promise.all([
        //   databases.listDocuments(
        //     process.env.VITE_DATABASE,
        //     process.env.VITE_LIKES_COLLECTION,
        //     [Query.equal('notice_id', notice.$id)]
        //   ),
        //   databases.listDocuments(
        //     process.env.VITE_DATABASE,
        //     process.env.VITE_SAVES_COLLECTION,
        //     [Query.equal('notice_id', notice.$id)]
        //   )
        // ]);

        // const likes = likesRes.documents;
        // const saves = savesRes.documents;
        // const likes = likesRes.documents;
        // const saves = savesRes.documents;

        // await Promise.allSettled([
        //   ...likes.map((like) =>
        //     databases.deleteDocument(
        //       process.env.VITE_DATABASE,
        //       process.env.VITE_LIKES_COLLECTION,
        //       like.$id
        //     )
        //   ),
        // await Promise.allSettled([
        //   ...likes.map((like) =>
        //     databases.deleteDocument(
        //       process.env.VITE_DATABASE,
        //       process.env.VITE_LIKES_COLLECTION,
        //       like.$id
        //     )
        //   ),

        //   ...saves.map((save) =>
        //     databases.deleteDocument(
        //       process.env.VITE_DATABASE,
        //       process.env.VITE_SAVES_COLLECTION,
        //       save.$id
        //     )
        //   )
        // ]);


        // const lks = await databases.listDocuments(
        //   process.env.VITE_DATABASE,
        //   process.env.VITE_LIKES_COLLECTION,
        //   [Query.equal('notice_id', notice.$id)]
        // );
        // const likes = lks.documents; 
        // log(likes); 
        // await Promise.allSettled(
        //   likes.map((like) =>
        //     databases.deleteDocument(
        //       process.env.VITE_DATABASE,
        //       process.env.VITE_LIKES_COLLECTION,
        //       like.$id
        //     )
        //   )
        // );

        // const svs = await databases.listDocuments(
        //   process.env.VITE_DATABASE,
        //   process.env.VITE_SAVES_COLLECTION,
        //   [Query.equal('notice_id', notice.$id)]
        // );
        // const saves = savesRes.documents;  
        // log(saves); 
        // await Promise.allSettled(
        //   saves.map((save) =>
        //     databases.deleteDocument(
        //       process.env.VITE_DATABASE,
        //       process.env.VITE_SAVES_COLLECTION,
        //       save.$id
        //     )
        //   )
        // );


      }
    }

  } catch (err) {
    error("Error deleting expired notices:", err);
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
