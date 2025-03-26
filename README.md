# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Add optional descriptions to tasks
- Real-time error handling and validation
- Responsive modern UI

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with your MongoDB connection string:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

### Available Frontend Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Removes the single build dependency

## API Documentation

### Endpoints

#### GET /tasks
- Description: Retrieve all tasks
- Response: Array of task objects
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "completed": boolean
  }
]
```

#### POST /tasks
- Description: Create a new task
- Request Body:
```json
{
  "title": "string",
  "description": "string (optional)"
}
```
- Response: Created task object

#### PUT /tasks/:id
- Description: Update a task
- URL Parameters: id (task ID)
- Request Body:
```json
{
  "title": "string",
  "description": "string",
  "completed": boolean
}
```
- Response: Updated task object

#### DELETE /tasks/:id
- Description: Delete a task
- URL Parameters: id (task ID)
- Response: Success message

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 404: Resource not found
- 500: Server error

Each error response includes a message explaining the error.

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)