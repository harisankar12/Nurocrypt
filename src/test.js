// Example: Testing a fake API using fetch and logging the result

async function testFakeApi() {
  const url = 'https://jsonplaceholder.typicode.com/posts/1';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('Error fetching API:', error);
  }
}

// Run the test

