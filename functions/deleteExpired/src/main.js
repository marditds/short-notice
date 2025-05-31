import { Client, Databases } from 'node-appwrite';

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
    )

    const notices = ntcs.documents;

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
        log(`Deleted expired notice: ${notice.text}`);
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
