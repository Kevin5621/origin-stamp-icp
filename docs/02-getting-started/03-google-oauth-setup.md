# Google OAuth Configuration Guide

## Setup Google OAuth

1. **Create Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Identity API**

   - Navigate to APIs & Services > Library
   - Search for "Google Identity"
   - Enable the Google Identity API

3. **Create OAuth 2.0 Client ID**

   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application" as the application type
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain
   - No redirect URIs needed for Google Identity Services

4. **Configure Environment Variables**
   ```bash
   # In your .env file
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.googleusercontent.com
   ```

## How It Works

### Google Sign In Flow

1. User clicks "Sign in with Google"
2. Google Identity popup appears
3. User selects Google account and grants permission
4. JWT token is received and parsed
5. User information is extracted and stored in AuthContext
6. User is redirected to dashboard

### Google Sign Up Flow

1. User clicks "Sign up with Google"
2. Same process as sign in, but with signup context
3. New user account is created using Google profile information

### User Data Structure

```typescript
interface User {
  username: string; // From Google: name
  email: string; // From Google: email
  picture: string; // From Google: profile picture URL
  loginTime: string; // When user logged in
  authType: "google"; // Authentication method used
}
```

## Security Features

- Uses Google Identity Services (GIS) - the latest OAuth implementation
- JWT tokens are parsed client-side for user info
- No sensitive data is stored permanently
- User can be logged out properly
- Popup-based flow prevents redirect issues

## Testing

1. Set your actual Google Client ID in `.env`
2. Start the development server: `npm start`
3. Click "Sign in with Google" or "Sign up with Google"
4. Test the authentication flow

## Troubleshooting

**Error: "Invalid Client ID"**

- Make sure VITE_GOOGLE_CLIENT_ID is correctly set
- Verify the Client ID is from the correct Google Cloud project
- Ensure the domain is added to authorized origins

**Error: "Popup blocked"**

- Enable popups for your development domain
- Try using a different browser

**Error: "Google library not loaded"**

- Check that the Google script is loaded in index.html
- Make sure you have internet connection for CDN access
