# Content-Type Headers

The application serves various types of resources, each requiring appropriate Content-Type headers to ensure proper handling by browsers and clients.

## Table of Contents

---

- [Content-Type Headers](#content-type-headers)
  - [Table of Contents](#table-of-contents)
  - [Media Types](#media-types)
    - [Images](#images)
    - [Scripts and Styles](#scripts-and-styles)
    - [Data](#data)
  - [Development Server Configuration](#development-server-configuration)
  - [Production Configuration](#production-configuration)
  - [Best Practices](#best-practices)
  - [Common Issues](#common-issues)
    - [Missing Charset](#missing-charset)
    - [Incorrect JavaScript Content-Type](#incorrect-javascript-content-type)
    - [SVG Content-Type](#svg-content-type)

## Media Types

---

### Images

- PNG files: `image/png`
- JPEG files: `image/jpeg`
- SVG files: `image/svg+xml; charset=utf-8`
- WebP files: `image/webp`
- GIF files: `image/gif`

### Scripts and Styles

- JavaScript files: `text/javascript; charset=utf-8`
- TypeScript files: `application/x-typescript; charset=utf-8`
- CSS files: `text/css; charset=utf-8`
- JSX files: `text/jsx; charset=utf-8`
- TSX files: `application/x-typescript; charset=utf-8`

### Data

- JSON files: `application/json; charset=utf-8`
- Text files: `text/plain; charset=utf-8`

## Development Server Configuration

---

The development server is configured to automatically set appropriate Content-Type headers through Vite's server middleware. This configuration is defined in `vite.config.ts`.

The middleware handles common file extensions and sets their corresponding Content-Type headers:

```typescript
server.middlewares.use((req, res, next) => {
  if (req.url?.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.url?.endsWith('.svg')) {
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  } else if (req.url?.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'text/jsx; charset=utf-8');
  } else if (req.url?.endsWith('.tsx') || req.url?.endsWith('.ts')) {
    res.setHeader('Content-Type', 'application/x-typescript; charset=utf-8');
  } else if (req.url?.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  next();
});
```

## Production Configuration

---

In production, the web server (e.g., Nginx, Apache) should be configured to send appropriate Content-Type headers. The server configuration should include mappings for all media types used by the application.

Example Nginx configuration:

```nginx
types {
    text/html                             html htm shtml;
    text/css                              css;
    text/javascript                       js;
    application/x-typescript              ts tsx;
    image/jpeg                            jpeg jpg;
    image/png                             png;
    image/svg+xml                         svg svgz;
    image/gif                             gif;
    image/webp                            webp;
}
```

## Best Practices

---

1. Always include the charset parameter for text-based content types
2. Use standard MIME types as defined by IANA
3. Set appropriate Content-Type headers for all responses
4. Include X-Content-Type-Options: nosniff header to prevent MIME type sniffing
5. Validate Content-Type headers in development and production environments

## Common Issues

---

### Missing Charset

Text-based resources should include the charset parameter to ensure proper character encoding interpretation. The application uses UTF-8 encoding for all text-based resources.

### Incorrect JavaScript Content-Type

While both `application/javascript` and `text/javascript` are valid, the HTML specification recommends using `text/javascript`. The application follows this recommendation.

### SVG Content-Type

SVG files require the `image/svg+xml` content type with UTF-8 charset for proper rendering and script execution within the SVG.
