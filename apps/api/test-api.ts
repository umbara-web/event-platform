const BASE_URL = 'http://localhost:8000/api';

async function request(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  return data;
}

async function runTests() {
  try {
    console.log('--- EVENT MANAGEMENT API TESTS ---');

    // 1. Register Organizer
    console.log('\n[1] Registering Organizer...');
    const organizerRes = await request('POST', '/auth/register', {
      name: 'Organizer Tester',
      email: `organizer_${Date.now()}@test.com`,
      password: 'password123',
      phone: '08123456789',
      role: 'ORGANIZER',
    });
    console.log('Success:', organizerRes);
    const organizerLogin = await request('POST', '/auth/login', {
      email: organizerRes.data.email,
      password: 'password123',
    });
    const orgToken = organizerLogin.data.token;

    // 2. Register Attendee
    console.log('\n[2] Registering Attendee...');
    const attendeeRes = await request('POST', '/auth/register', {
      name: 'Attendee Tester',
      email: `attendee_${Date.now()}@test.com`,
      password: 'password123',
      phone: '08987654321',
      role: 'ATTENDEE',
    });
    console.log('Success:', attendeeRes);
    const attendeeLogin = await request('POST', '/auth/login', {
      email: attendeeRes.data.email,
      password: 'password123',
    });
    const attToken = attendeeLogin.data.token;

    // 3. Create Event (As Organizer)
    console.log('\n[3] Creating Event (Organizer)...');
    const eventRes = await request(
      'POST',
      '/events',
      {
        title: 'Tech Conference 2026',
        description: 'Biggest tech gathering.',
        format: 'OFFLINE',
        locationOrLink: 'Jakarta Convention Center',
        dateTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      },
      orgToken
    );
    console.log('Success:', eventRes);
    const eventId = eventRes.data.id;

    // 4. Create Ticket for Event
    console.log('\n[4] Creating Ticket for Event...');
    const ticketRes = await request(
      'POST',
      `/events/${eventId}/tickets`,
      {
        name: 'General Admission',
        price: 150000,
        capacity: 100,
      },
      orgToken
    );
    console.log('Success:', ticketRes);
    const ticketId = ticketRes.data.id;

    // 5. Register Attendee to Event
    console.log('\n[5] Registering Attendee to Event...');
    const regRes = await request(
      'POST',
      `/events/${eventId}/register`,
      {
        ticketId,
        attendeeName: 'Attendee Tester',
        attendeeEmail: attendeeRes.data.email,
        attendeePhone: '08987654321',
      },
      attToken
    );
    console.log('Success:', regRes);

    // 6. Get All Events
    console.log('\n[6] Fetching All Events...');
    const allEventsRes = await request('GET', '/events');
    console.log('Success: Found', allEventsRes.data.length, 'events.');

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
  } catch (error: any) {
    console.error('\n--- TEST FAILED! ---');
    console.error(error.message);
  }
}

runTests();
