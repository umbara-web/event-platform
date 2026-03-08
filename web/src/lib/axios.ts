import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can't automatically attach the token in a simple axios interceptor effectively in Next.js App Router (Client vs Server components issues).
// Therefore, for client-side requests, the token will be attached via useSession hook and passing it to the API calls directly.
// For server-side requests, the token will be extracted from getServerSession().

export default api;
