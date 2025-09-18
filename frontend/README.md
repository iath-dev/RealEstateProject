# Real Estate Frontend

This is the frontend for the Real Estate project, developed with React, TypeScript, and Vite.

## Features

- **Property List:** Display a list of properties with infinite scrolling.
- **Property Details:** View the details of a property in a dialog.
- **Filtering:** Filter properties by name, address, and price range.
- **Responsive Design:** The application is designed to work on different screen sizes.

## Development

The entire project, including this frontend, is designed to be run via Docker. Please see the [main README file](../../README.md) for instructions on how to start the application.

### Running Locally

If you want to run the frontend in development mode separately from the rest of the project, you can do so with the following commands:

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Create a `.env.local` file:**

   Create a `.env.local` file in the `frontend` directory and add the following environment variable.

   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

   **Note:** The URL above (`8080`) is for connecting to the backend running inside Docker. If you are running the backend locally (`dotnet run`), you should use its local port:

   ```
   VITE_API_BASE_URL=http://localhost:5129/api
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`.

### Running Tests

To run the Cypress tests for the frontend, you can use the following command from the root of the project:

```sh
make test
```

Alternatively, you can run the tests directly from the `frontend` directory:

```bash
# To run tests headlessly
pnpm test

# To open the Cypress Test Runner
pnpm test:open
```

## Folder Structure

The `src` folder is organized as follows:

- **`api`:** Contains the code for interacting with the backend API.
- **`components`:** Contains reusable components.
  - **`common`:** Generic components that can be used in any part of the application.
  - **`layout`:** Components that define the structure of the application.
  - **`ui`:** UI components like buttons, inputs, etc.
- **`features`:** Contains the code for the different features of the application.
- **`hooks`:** Contains custom hooks.
- **`lib`:** Contains utility functions.
- **`pages`:** Contains the pages of the application.
- **`providers`:** Contains the providers for the application (e.g., `QueryClientProvider`).
- **`store`:** Contains the Zustand store for state management.
- **`styles`:** Contains the global styles for the application.
- **`utils`:** Contains utility functions.
