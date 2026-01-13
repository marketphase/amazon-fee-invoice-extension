# Building and Releasing the Extension

## Prerequisites

- Node.js >= 22.15.1
- pnpm 10.11.0+

## Development

```bash
# Install dependencies
pnpm install

# Start development mode with hot reload
pnpm dev
```

Load the `dist` folder as an unpacked extension in Chrome (`chrome://extensions` > Developer mode > Load unpacked).

## Building for Production

```bash
# Build the extension
pnpm build
```

The built extension will be in the `dist/` folder.

## Creating a Release Zip

To create a zip file for uploading to the Chrome Web Store:

```bash
pnpm zip
```

This will:
1. Run a production build
2. Create a timestamped zip file in `dist-zip/` (e.g., `extension-20260113-134027.zip`)

The zip is structured correctly with `manifest.json` at the root, as required by Chrome Web Store.

## Updating the Version

Before releasing a new version, update the version number in:

```
chrome-extension/package.json
```

The manifest version is read from this file during build. Chrome Web Store requires each new upload to have a higher version than the previous release.

Example:
```json
{
  "version": "1.0.3"
}
```

## Uploading to Chrome Web Store

1. Run `pnpm zip`
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the latest zip from `dist-zip/`
