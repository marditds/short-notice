import { Client, TablesDB, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.SHORT_NOTICE_API_KEYS);

  const tablesDB = new TablesDB(client);

  try {
    const ntcs = await tablesDB.listRows({
      databaseId: process.env.VITE_DATABASE,
      tableId: process.env.VITE_NOTICES_COLLECTION
    });

    const now = new Date();

    for (const notice of ntcs.rows) {
      const expiresAt = new Date(notice.expiresAt);

      if (!notice.expiresAt || isNaN(expiresAt) || expiresAt > now) {
        continue;
      }

      const noticeId = notice.$id;

      // Delete related likes
      const likes = await tablesDB.listRows({
        databaseId: process.env.VITE_DATABASE,
        tableId: process.env.VITE_LIKES_COLLECTION,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(likes.rows.map((like) =>
        tablesDB.deleteRow({
          databaseId: process.env.VITE_DATABASE,
          tableId: process.env.VITE_LIKES_COLLECTION,
          rowId: like.$id
        })
      ));
      log(`Deleted likes for notice: ${noticeId}`);

      // Delete related saves
      const saves = await tablesDB.listRows({
        databaseId: process.env.VITE_DATABASE,
        tableId: process.env.VITE_SAVES_COLLECTION,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(saves.rows.map((save) =>
        tablesDB.deleteRow({
          databaseId: process.env.VITE_DATABASE,
          tableId: process.env.VITE_SAVES_COLLECTION,
          rowId: save.$id
        })
      ));
      log(`Deleted saves for notice: ${noticeId}`);

      // Delete related reactions
      const reactions = await tablesDB.listRows({
        databaseId: process.env.VITE_DATABASE,
        tableId: process.env.VITE_REACTIONS_COLLECTION,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(reactions.rows.map((reaction) =>
        tablesDB.deleteRow({
          databaseId: process.env.VITE_DATABASE,
          tableId: process.env.VITE_REACTIONS_COLLECTION,
          rowId: reaction.$id
        })
      ));
      log(`Deleted reactions for notice: ${noticeId}`);

      // Delete the notice
      await tablesDB.deleteRow({
        databaseId: process.env.VITE_DATABASE,
        tableId: process.env.VITE_NOTICES_COLLECTION,
        rowId: noticeId
      });
      log(`Deleted expired notice: ${notice.text}`);
    }

  } catch (err) {
    error("Error deleting expired notices and related data:", err);
  }

  return res.json({
    message: "Expired notices and associated data cleaned up.",
  });
};
