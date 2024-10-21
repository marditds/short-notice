import { Client, Users } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client()
    .setEndpoint(process.env.VITE_ENDPOINT) // Appwrite endpoint
    .setProject(process.env.VITE_PROJECT) // Project ID
    .setKey(process.env.VITE_SHORT_NOTICE_API_KEYS); // API Key for privileged access

  const users = new Users(client);

  try {
    log(`Checking payload: ${req.payload}`)
    // Check if payload is present
    if (!req.payload) {
      throw new Error('Request payload is missing.');
    } else {
      log(req.payload)
    }

    // Extract email from request body (assuming it's passed in the request payload)
    const data = JSON.parse(req.payload);
    log('Parsed payload: ' + JSON.stringify(data));

    if (!data.email) {
      throw new Error('Email not provided.');
    }
    log(`Checking email: ${data.email}`)
    // Query users by email
    const response = await users.list([`email=${data.email}`]);

    log(`Response from Appwrite: ${JSON.stringify(response)}`);


    // return res.json({
    //   emailExists: response.total > 0
    // });
    const result = {
      emailExists: response.total > 0,
      success: true
    };
    log('Sending response: ' + JSON.stringify(result));
    return res.json(result);

    // log(`result: ${result}`)
    // log(`Email check result for ${email}: ${result.emailExists}`);
    // return res.json(result);
  } catch (err) {
    error("Error occurred: " + err.message);
    return res.json({ success: false, message: err.message });
  }
};


// ____________________________________________________
// import { Client, Users, ID } from 'node-appwrite';

// export const client = new Client()
//   .setEndpoint(process.env.VITE_ENDPOINT)
//   .setProject(process.env.VITE_PROJECT)
//   .setKey(process.env.VITE_SHORT_NOTICE_API_KEYS);


// const users = new Users(client);

// export const deleteUser = async (userId) => {
//   try {
//     await users.delete(userId);
//   } catch (error) {
//     console.error('Error deleting auth user:', error);
//   }
// }

// app.post('/api/delete-account', async (req, res) => {
//   const { userId } = req.body;
//   try {
//     await deleteUser(userId);
//     res.status(200).send('User deleted successfully');
//   } catch (error) {
//     res.status(500).send('Failed to delete user');
//   }
// });

// export const checkEmailExistsInAuth = async (email) => {
//   try {
//     const response = await users.list([`email=${email}`]);

//     if (response.total > 0) {
//       console.log('Email exists in Auth:', email);
//       return true;
//     } else {
//       console.log('Email does not exist in Auth:', email);
//       return false;
//     }
//   } catch (error) {
//     console.error('Error checking email:', error);
//     throw error;
//   }
// };

// This Appwrite function will be executed every time your function is triggered
// export default async ({ req, res, log, error }) => {
// You can use the Appwrite SDK to interact with other services
// For this example, we're using the Users service

// try {
// log(`User created successfully: ${newUser.$id}`);

// const response = await users.list();
// Log messages and errors to the Appwrite Console
// These logs won't be seen by your end users

// log(`Total users: ${response.length}`);
// } catch (err) {
// error("Could not list users: " + err.message);
// }

// The req object contains the request data
// if (req.path === "/ping") {
// Use res object to respond with text(), json(), or binary()
// Don't forget to return a response!
// return res.text("Pong");
// }

//   return res.json({
//     motto: "cvcvxcvc",
//     learn: "https://appwrite.io/docs",
//     connect: "https://appwrite.io/discord",
//     getInspired: "https://builtwith.appwrite.io",
//   });
// };

// import { Client, Users, ID } from 'node-appwrite';

// module.exports = async function (req, res) {
// Initialize the Appwrite client
// const client = new Client()
// .setEndpoint(process.env.APPWRITE_ENDPOINT) // Use Appwrite's environment variables
// .setProject(process.env.APPWRITE_PROJECT_ID)
// .setKey(process.env.APPWRITE_API_KEY);

// const users = new Users(client);

// const { userId } = JSON.parse(req.payload);  // Extract the userId from the payload
// if (req.path === '/api/delete-account') {
//   try {
// Delete the user
//       await users.delete(userId);
//       res.json({ success: true, message: 'User deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       res.json({ success: false, message: 'Failed to delete user' });
//     }
//   }
// };
