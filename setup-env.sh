#!/bin/bash

# Update frontend .env with GitHub OAuth credentials
cat > frontend/.env << EOF
# Next.js Environment Variables

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=X2bKJuRKnojkgqHkkvj/g9/pe4Ifdkie9T/MG0lawk0=

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liqIjXswpHvlkKGB
GITHUB_CLIENT_SECRET=ff032afc920e227ad7617fd0a92399dbf4166df2

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF

echo "✅ Frontend .env configured with GitHub OAuth credentials"

# Check if backend .env exists
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Backend .env created from example"
fi

echo "✅ Environment setup complete!"
