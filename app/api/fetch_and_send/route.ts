import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Replace with your actual Render Flask API URL
    const FLASK_API_URL = 'https://steadymdlookerview.onrender.com/fetch_and_send';
    
    const response = await fetch(FLASK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok (status code 200)
    if (!response.ok) {
      // If the response is not OK, get the text and log it
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { error: 'Backend error: ' + errorText },
        { status: 500 }
      );
    }

    // If the response is ok, parse as JSON
    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}
