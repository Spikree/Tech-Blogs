This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## environment variables required

```bash
MONGODB_URI=
appName=
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
NEXTAUTH_URL=
NEXTAUTH_URL_INTERNAL=
NEXTAUTH_SECRET=
```
To get your google auth provider go to (https://console.cloud.google.com/)

## Troubleshooting

1. Port Already in Use: Kill the process running on the port or change the port in package.json.
2. Environment Variable Errors: Ensure all required variables are set in the .env file.

## Known Issues
1. The saved blogs route is visible in the development app but not on the hosted website.

## Future Features
1. Dark Mode Support:
Implement a toggle for light and dark themes.

2. Search Functionality
Implement a search functionality to search blogs and users by their name

3. Like comments and reply to comments
Implement a feature to like the comments and reply to the comments