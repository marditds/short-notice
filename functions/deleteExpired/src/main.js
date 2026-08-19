import { Client, TablesDB, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.SHORT_NOTICE_API_KEYS);

  const dbId = process.env.VITE_DATABASE;
  const noticesDbId = process.env.VITE_NOTICES_COLLECTION;
  const likessDbId = process.env.VITE_LIKES_COLLECTION;
  const savesDbId = process.env.VITE_SAVES_COLLECTION;
  const reactionsDbId = process.env.VITE_REACTIONS_COLLECTION;

  const tablesdb = new TablesDB(client);

  try {
    const ntcs = await tablesdb.listRows({
      databaseId: dbId,
      tableId: noticesDbId
    });

    const now = new Date();

    for (const notice of ntcs.rows) {
      const expiresAt = new Date(notice.expiresAt);

      if (!notice.expiresAt || isNaN(expiresAt) || expiresAt > now) {
        continue;
      }

      const noticeId = notice.$id;

      // Delete related likes
      const likes = await tablesdb.listRows({
        databaseId: dbId,
        tableId: likessDbId,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(likes.rows.map((like) =>
        tablesdb.deleteRow({
          databaseId: dbId,
          tableId: likessDbId,
          rowId: like.$id
        })
      ));
      log(`Deleted likes for notice: ${noticeId}`);

      // Delete related saves
      const saves = await tablesdb.listRows({
        databaseId: dbId,
        tableId: savesDbId,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(saves.rows.map((save) =>
        tablesdb.deleteRow({
          databaseId: dbId,
          tableId: savesDbId,
          rowId: save.$id
        })
      ));
      log(`Deleted saves for notice: ${noticeId}`);

      // Delete related reactions
      const reactions = await tablesdb.listRows({
        databaseId: dbId,
        tableId: reactionsDbId,
        queries: [Query.equal('notice_id', noticeId)]
      });
      await Promise.allSettled(reactions.rows.map((reaction) =>
        tablesdb.deleteRow({
          databaseId: dbId,
          tableId: reactionsDbId,
          rowId: reaction.$id
        })
      ));
      log(`Deleted reactions for notice: ${noticeId}`);

      // Delete the notice
      await tablesdb.deleteRow({
        databaseId: dbId,
        tableId: noticesDbId,
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
