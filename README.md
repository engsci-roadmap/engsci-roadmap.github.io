# EngSci Cheatcode Platform

This is the main web application for the EngSci Cheatcode platform, built with React, TypeScript, and Vite.

## Features

- **Interactive Course Roadmaps**: NeetCode-style directed acyclic graphs (DAGs) for visualizing learning paths
- **Course Resources**: Organized collection of course materials, practice problems, and study guides
- **Year-specific Content**: Resources organized by year and semester for easy navigation

## Getting Started

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm run dev
```

## Deployment

This project is configured for deployment to GitHub Pages.

### Automatic Deployment

Pushing to the `main` branch will automatically trigger a GitHub Actions workflow that builds and deploys the site to GitHub Pages.

### Manual Deployment

You can also deploy manually using:

```
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

### GitHub Repository Setup

1. Make sure your repository settings have GitHub Pages enabled
2. Go to Settings > Pages
3. Set the source to "Deploy from a branch"
4. Select the `gh-pages` branch and root folder
5. Save the settings

The site will be available at: https://your-username.github.io/engsci-roadmap.github.io/

## Roadmap Components

### NeetCodeRoadmap

The platform features a NeetCode-style roadmap component that visualizes learning paths as directed acyclic graphs:

- Located in `src/components/roadmap/NeetCodeRoadmap.tsx`
- Uses ReactFlow for interactive graph visualization
- Features custom styled nodes with blue backgrounds and white underlines
- Implements animated directional arrows to show progression paths
- Supports node click interactions to view additional information

### Implementation Details

- **Node Styling**: Custom nodes with blue background, white text, and underlines
- **Edge Configuration**: Animated white arrows with enhanced visibility
- **Interaction**: Click handlers for displaying topic-specific information
- **Layout**: Responsive design with dark background for improved contrast

## Required Dependencies

Make sure to install ReactFlow:

```
npm install reactflow
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
