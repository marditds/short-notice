import { Client, Query, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.SHORT_NOTICE_API_KEYS);

  const databases = new Databases(client);

  try {
    const res = await databases.listDocuments(
      process.env.VITE_DATABASE,
      process.env.VITE_REACTIONS_COLLECTION
    )

    const reactions = res.documents;

    const now = new Date();

    for (const reaction of reactions) {

      const expiresAt = new Date(reaction.expiresAt);

      if (reaction.expiresAt !== null) {

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
            ...likes.map((like) => {
              const deleteLike = databases.deleteDocument(
                process.env.VITE_DATABASE,
                process.env.VITE_LIKES_COLLECTION,
                like.$id
              );
              log(`Deleted expired like: ${like.notice_id}`);
              return deleteLike;
            }),

            ...saves.map((save) => {
              const deleteSave = databases.deleteDocument(
                process.env.VITE_DATABASE,
                process.env.VITE_SAVES_COLLECTION,
                save.$id
              );
              log(`Deleted expired save: ${save.notice_id}`);
              return deleteSave;
            })
          ]);

          await databases.deleteDocument(
            process.env.VITE_DATABASE,
            process.env.VITE_REACTIONS_COLLECTION,
            reaction.$id);
          log(`Deleted expired reaction: ${reaction.$id}`);
        }

      }
    }

  } catch (err) {
    console.error("Error deleting expired notices:", error);
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
}; 