# Deploying to Vercel

This document provides step-by-step instructions for deploying the EngSci Cheatcode application to Vercel.

## Prerequisites

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (you can sign up with your GitHub account)

## Deployment Steps

### 1. Push your code to GitHub

Make sure your project is pushed to a GitHub repository.

### 2. Connect Vercel to your GitHub repository

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Vercel will automatically detect that this is a Vite + React project

### 3. Configure deployment settings

In the deployment configuration screen:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `dist` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### 4. Environment Variables

No special environment variables are needed for this project.

### 5. Deploy

Click the "Deploy" button. Vercel will build and deploy your application.

## Troubleshooting

### Issue: Data not loading properly

If you encounter issues with JSON data not loading:

1. Ensure that all data files are correctly imported in your components as static imports
2. Verify that the file paths are correct
3. Check the Vercel build logs for any errors related to JSON imports

### Issue: 404 errors when accessing routes directly

If you get 404 errors when accessing routes like `/y1f` directly:

1. Check that the `vercel.json` file is correctly configured
2. Make sure the `rewrites` rule is correctly set to redirect all routes to `index.html`

## Vercel CLI Deployment (Alternative)

You can also deploy using the Vercel CLI:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from your project directory
3. Follow the prompts to configure your deployment

For more information, visit [Vercel Documentation](https://vercel.com/docs).
