export async function onRequest({request, next, env}) {
  const authHeader = request.headers.get('Authorization');
  
  // Check if the Authorization header is present and starts with 'Basic'
  if(!authHeader?.includes('Basic')) {
    return promptForAuth();
  }
  
  // Decode credentials
  const base64Credentials = authHeader.split(' ')[1];
  const [username, password] = atob(base64Credentials).split(':');
  
  // Check if credentials match
  if (username !== env.BASIC_AUTH_USERNAME || password !== env.BASIC_AUTH_PASSWORD) {
    // Invalid credentials - prompt for authentication
    return promptForAuth();
  }
  
  // Valid credentials - proceed to next handler
  return await next();
}

function promptForAuth() {
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic' }
  });
}
