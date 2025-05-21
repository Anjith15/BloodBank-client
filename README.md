# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Favicon Generation

To fix the favicon 404 error after deployment:

1. We've added an SVG favicon to the project at `public/favicon.svg`
2. We've updated the HTML to use this favicon
3. For browsers that specifically request favicon.ico, you'll need to generate it:
   - Go to https://favicon.io/favicon-converter/ 
   - Upload the SVG file from `public/favicon.svg`
   - Download the generated favicon.ico
   - Place it in the `public` directory
4. Redeploy the application
