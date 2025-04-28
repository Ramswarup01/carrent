// api/users.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Example: Fetch user info (this could come from a database)
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };

    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
