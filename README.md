# hire-jeff-green-11ty

## Commands

- Development server: `npm start` or `npx @11ty/eleventy --serve`
- Build site: `npm run build`
- Lint code: `npm run lint`
- Auto-fix linting issues: `npm run lint:fix`

## ESLint Configuration

The project uses ESLint v9.19.0 with the new flat configuration format in `eslint.config.js`. This setup includes:

- Basic JavaScript code quality rules
- Integration with Prettier formatting
- CommonJS module format support for the Eleventy configuration
- Specific configuration for `.eleventy.js`
- Ignore patterns for non-JavaScript files and build artifacts

To check your code for linting issues:

```bash
npm run lint
```

To automatically fix linting issues where possible:

```bash
npm run lint:fix
```

## Prettier Configuration

Code formatting is handled by Prettier v3.4.2, configured in `.prettierrc`. Key settings include:

- 80 character print width
- 2 space indentation
- Single quotes for strings
- Semicolons at the end of statements
- ES5 trailing commas
- Unix line endings (LF)
