import { Client, Users, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT) // Appwrite endpoint
    .setProject(process.env.VITE_PROJECT) // Project ID
    .setKey(process.env.VITE_SHORT_NOTICE_API_KEYS); // API Key for privileged access

  const users = new Users(client);

  try {
    log('Request method: ' + req.method);
    log('Request headers: ' + JSON.stringify(req.headers));
    log('Raw body: ' + req.body);
    log('Raw payload: ' + req.payload);

    if (!req.body) {
      throw new Error('Request body is missing.');
    }

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!data.email) {
      throw new Error('Email not provided.');
    }

    const response = await users.list(
      [Query.equal['email', data.email]]
    );

    await users.delete(response.users[0].$id);
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`User deleted successfully.`);
  } catch (err) {
    error("Could not delete user: " + err.message);
  }


  return res.json({ msg: 'User delete from Appwrite.' });
};
