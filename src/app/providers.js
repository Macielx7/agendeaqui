// app/providers.js
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId="301779624998-uncfv4kckf4s39ja0r8gvg15ed660l1g.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
