# Flipsy
A modern, browser-based image conversion tool built with TypeScript and React. It allows users to quickly convert images between different formats without needing to install any software.
___

<p align="center">
  <img src="src/assets/images/logo.svg" alt="Flipsy Logo" width="350" />
</p>

---

### Features

- Convert images between common formats (JPEG, PNG, WebP, GIF, BMP)
- Process images directly in the browser (no server uploads required)
- Intuitive and responsive user interface
- Secure - your images never leave your computer

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kdraslan/flipsy.me.git
   cd flipsy.me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## How to Use

1. Drag and drop image files onto the dropzone or click to select files
2. Select your desired output format
3. Click "Convert" to transform your image
4. Download the converted file

## Available Scripts

### `npm run dev` or `npm start`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`

Previews the built application locally before deployment.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm run lint:fix`

Runs ESLint and attempts to automatically fix issues.

### `npm run format`

Formats your code using Prettier.

### `npm run sort-package`

Sorts the package.json file for consistency.

## Live Demo

Visit [flipsy.me](https://flipsy.me) to try the application online.

## Technology Stack

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **Linting**: ESLint with Prettier integration
- **Hosting**: Firebase

## Contributing

Contributions are welcome! Please feel free to submit a PR.

### Code Style

This project uses ESLint and Prettier to maintain code quality and consistency:

- Run `npm run lint` to check for code issues
- Run `npm run format` to format your code before committing
- Run `npm run lint:fix` to automatically fix ESLint issues

## Browser Support

### Production
- Last 2 versions of major browsers
- Browsers with >1% market share
- No support for IE 11

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## License

This project is licensed under the MIT License.
