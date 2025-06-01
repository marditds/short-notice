import { Client, Users, Query } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT) // Appwrite endpoint
    .setProject(process.env.VITE_PROJECT) // Project ID
    .setKey(process.env.SHORT_NOTICE_API_KEYS); // API Key for privileged access

  const users = new Users(client);

  try {
    log('NEW LOG FOR TESTING!');
    log('Request method: ' + req.method);
    log('Request headers: ' + JSON.stringify(req.headers));
    log('Raw body: ' + req.body);
    log('Raw payload: ' + req.payload);
    // Check if payload is present
    if (!req.body) {
      throw new Error('Request body is missing.');
    } else {
      log(req.payload)
    }

    // Extract email from request body 
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    log('Not-parsed data:');
    log(data);
    log('Parsed data: ' + JSON.stringify(data));

    if (!data.email) {
      throw new Error('Email not provided.');
    }
    log(`Checking email: ${data.email}`)

    // Query users by email
    const response = await users.list([Query.equal('email', data.email)]);


    log(`Response from Appwrite: ${JSON.stringify(response)}`);


    const result = {
      emailExists: response.total > 0,
      success: true
    };

    log('Sending response: ' + JSON.stringify(response.users[0]));

    return res.json(response.users[0]);

  } catch (err) {
    error("Error occurred: " + err.message);
    return res.json({ success: false, message: err.message });
  }
};

