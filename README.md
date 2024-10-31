# CalmAPI REST Client

CalmAPI REST Client is a powerful and free REST client designed to help developers test and interact with RESTful APIs. Built with Tauri, React, and TypeScript, it offers a seamless and efficient experience for API testing.

## Features

- **Cross-Platform**: Available on Windows, macOS, and Linux.
- **User-Friendly Interface**: Intuitive and easy-to-use interface for making API requests.
- **Request Customization**: Supports various HTTP methods, headers, and body types.
- **Response Viewer**: Displays formatted JSON responses, headers, and status codes.
- **Authorization**: Supports different types of authorization mechanisms.
- **Persistent Storage**: Save and manage your API requests.
- **Auto-Updater**: Automatically checks for and installs updates.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the Tauri application:

   ```sh
   npm run tauri build
   ```

### Running the Development Server

To start the development server, run:

```sh
npm run tauri dev
```

This will start both the Vite development server and the Tauri application.

### Building for Production

To build the project for production, run:

```sh
npm run tauri build
```

This will create a production-ready build of the React application and package it with Tauri.

## Usage

### Making a Request

1. Open the application.
2. Select the HTTP method (GET, POST, PUT, DELETE, etc.).
3. Enter the URL of the API endpoint.
4. Add headers, body, and authorization as needed.
5. Click "Send" to make the request.
6. View the response in the response viewer.

### Saving Requests

1. After configuring your request, click "Save".
2. Enter a name for the request and save it.
3. Access saved requests from the "Saved Requests" section.

## License

This project is licensed under the MIT License.
