# System Frontend Portal

This project is a React-based web application designed for user authentication and management. It includes features for user login, registration, profile management, and dashboards for both admin and regular users.

## Project Structure

The project is organized as follows:

```
system-frontend-portal
├── src
│   ├── index.tsx                # Entry point of the application
│   ├── App.tsx                  # Main routing setup
│   ├── layouts
│   │   └── Layout.tsx           # Layout structure including NavBar
│   ├── components
│   │   └── NavBar.tsx           # Navigation bar component
│   ├── pages
│   │   ├── Login.tsx            # Login page component
│   │   ├── Registration.tsx      # Registration page component
│   │   ├── Profile.tsx           # Profile page component
│   │   ├── AdminDashboard.tsx    # Admin dashboard component
│   │   └── UserDashboard.tsx     # User dashboard component
│   ├── hooks
│   │   └── useAuth.ts           # Custom hook for authentication logic
│   ├── services
│   │   └── api.ts                # API service functions
│   ├── styles
│   │   └── global.css            # Global styles
│   └── types
│       └── index.ts              # TypeScript types and interfaces
├── package.json                  # NPM configuration file
├── tsconfig.json                 # TypeScript configuration file
├── .eslintrc.json                # ESLint configuration file
├── .prettierrc                   # Prettier configuration file
└── README.md                     # Project documentation
```

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd system-frontend-portal
npm install
```

## Running the Application

To run the application in development mode, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Features

- User authentication (login and registration)
- Profile management
- Admin and user dashboards
- Responsive design

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.