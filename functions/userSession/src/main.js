import { Client, Users, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT)
    .setKey(process.env.SHORT_NOTICE_API_KEYS);


  const users = new Users(client);

  let userSessions = null;

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
      [Query.equal('email', data.email)]
    );

    userSessions = await users.listSessions(response.users[0].$id);

    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`BEFORE: userSessions for ${response.users[0].email}: ${JSON.stringify(userSessions)}`);


  } catch (err) {
    error("Could not list users: " + err.message);
  }


  return res.json(userSessions);
};
