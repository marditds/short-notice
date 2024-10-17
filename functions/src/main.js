import { Client, Users, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_ENDPOINT)
  .setProject(process.env.VITE_PROJECT)
  .setKey(req.headers['x-appwrite-key'] ?? process.env.VITE_SHORT_NOTICE_API_KEYS);

const users = new Users(client);

const newUser = await users.create(
  ID.unique(), // userId
  'my@mail.com', // email (optional)
  '+13102548866', // phone (optional)
  '',
  'Hakopos' // name (optional)
);

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service

  // const client = new Client()
  //   .setEndpoint(process.env.VITE_ENDPOINT)
  //   .setProject(process.env.VITE_PROJECT)
  //   .setKey(req.headers['x-appwrite-key'] ?? process.env.VITE_SHORT_NOTICE_API_KEYS);

  // const users = new Users(client);


  try {

    // const newUser = await users.create(
    //   ID.unique(), // userId
    //   'my@mail.com', // email (optional)
    //   '+13102548866', // phone (optional)
    //   '',
    //   'Hakopos' // name (optional)
    // );

    log(`User created successfully: ${newUser.$id}`);

    const response = await users.list();
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Total users: ${response.length}`);
  } catch (err) {
    error("Could not list users: " + err.message);
  }

  // The req object contains the request data
  if (req.path === "/ping") {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    return res.text("Pong");
  }

  return res.json({
    motto: "cvcvxcvc",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};


// export const authenticatedUsers = async () => {
//   try {
//     const result = await users.create(
//       ID.unique(), // userId
//       'email@example.com', // email (optional)
//       '+12065550100', // phone (optional)
//       '', // password (optional)
//       'Hakopos' // name (optional)
//     );
//     console.log('result', result);
//     return result;
//   } catch (error) {
//     console.error('Error - ', error);
//   }
// }
