import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.SHORT_NOTICE_API_KEYS);

  const databases = new Databases(client);

  try {
    const ntcs = await databases.listDocuments(
      process.env.VITE_DATABASE,
      process.env.VITE_NOTICES_COLLECTION
    );

    const now = new Date();

    for (const notice of ntcs.documents) {
      const expiresAt = new Date(notice.expiresAt);

      if (!notice.expiresAt || isNaN(expiresAt) || expiresAt > now) {
        continue;
      }

      const noticeId = notice.$id;

      // Delete related likes
      const likes = await databases.listDocuments(
        process.env.VITE_DATABASE,
        process.env.VITE_LIKES_COLLECTION,
        [Query.equal('notice_id', noticeId)]
      );
      await Promise.allSettled(likes.documents.map((like) =>
        databases.deleteDocument(
          process.env.VITE_DATABASE,
          process.env.VITE_LIKES_COLLECTION,
          like.$id
        )
      ));
      log(`Deleted likes for notice: ${noticeId}`);

      // Delete related saves
      const saves = await databases.listDocuments(
        process.env.VITE_DATABASE,
        process.env.VITE_SAVES_COLLECTION,
        [Query.equal('notice_id', noticeId)]
      );
      await Promise.allSettled(saves.documents.map((save) =>
        databases.deleteDocument(
          process.env.VITE_DATABASE,
          process.env.VITE_SAVES_COLLECTION,
          save.$id
        )
      ));
      log(`Deleted saves for notice: ${noticeId}`);

      // Delete related reactions
      const reactions = await databases.listDocuments(
        process.env.VITE_DATABASE,
        process.env.VITE_REACTIONS_COLLECTION,
        [Query.equal('notice_id', noticeId)]
      );
      await Promise.allSettled(reactions.documents.map((reaction) =>
        databases.deleteDocument(
          process.env.VITE_DATABASE,
          process.env.VITE_REACTIONS_COLLECTION,
          reaction.$id
        )
      ));
      log(`Deleted reactions for notice: ${noticeId}`);

      // Delete the notice
      await databases.deleteDocument(
        process.env.VITE_DATABASE,
        process.env.VITE_NOTICES_COLLECTION,
        noticeId
      );
      log(`Deleted expired notice: ${notice.text}`);
    }

  } catch (err) {
    error("Error deleting expired notices and related data:", err);
  }

  return res.json({
    message: "Expired notices and associated data cleaned up.",
  });
};
