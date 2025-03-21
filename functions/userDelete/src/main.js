import { Client, Users, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT) // Appwrite endpoint
    .setProject(process.env.VITE_PROJECT) // Project ID
    .setKey(process.env.SHORT_NOTICE_API_KEYS); // API Key for privileged access

  const users = new Users(client);

  try {
    log('Request method: ' + req.method);
    // log('Request headers: ' + JSON.stringify(req.headers));
    log('Raw body: ' + req.body);
    // log('Raw payload: ' + req.payload);

    if (!req.body) {
      throw new Error('Request body is missing.');
    }

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log('data:', data);

    log('data:', data)
    log('data.$id:', data.$id)


    const result = await users.list();

    log('users.list:', result);
    log('barev');

    if (!data.$id) {
      throw new Error('ID not provided.');
    }

    // const response = await users.list(
    // [Query.equal('email', data.email)]
    // );

    // await users.delete(response.users[0].$id);
    await users.delete(data.$id);
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`AUTH User deleted successfully.`);
  } catch (err) {
    error("Could not delete AUTH user: " + err.message);
  }

  return res.json({ msg: 'User deleted from Appwrite.' });
};
