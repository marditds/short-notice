import { Client, Users, ID } from 'node-appwrite';

export const client = new Client()
  .setEndpoint(process.env.VITE_ENDPOINT)
  .setProject(process.env.VITE_PROJECT)
  .setKey(process.env.VITE_SHORT_NOTICE_API_KEYS);


const users = new Users(client);

export const deleteUser = async (userId) => {
  try {
    await users.delete(userId);
  } catch (error) {
    console.error('Error deleting auth user:', error);
  }
}

app.post('/api/delete-account', async (req, res) => {
  const { userId } = req.body;
  try {
    await deleteUser(userId); // Call function to delete the user
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Failed to delete user');
  }
});

// This Appwrite function will be executed every time your function is triggered
// export default async ({ req, res, log, error }) => {
// You can use the Appwrite SDK to interact with other services
// For this example, we're using the Users service

// try {
// log(`User created successfully: ${newUser.$id}`);

// const response = await users.list();
// Log messages and errors to the Appwrite Console
// These logs won't be seen by your end users

//   log(`Total users: ${response.length}`);
// } catch (err) {
//   error("Could not list users: " + err.message);
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
