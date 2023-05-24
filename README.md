# MERN Blog App API

This repository contains the API code for the MERN Blog App.

## Description

The MERN Blog App API is built using Express.js and provides backend functionality for the MERN Blog App. It includes user registration, authentication, post creation and update, and fetching post data for the homepage.

## Installation

1. Clone the repository:
    git clone https://github.com/YourUsername/MERN-Blog-App-API.git

2. Install the dependencies:
    cd MERN-Blog-App-API 
    npm install

3. Set up environment variables:

- Create a `.env` file in the root directory of the API.
- Add the following variables to the `.env` file:

  ```
  MONGODB_URI=your_mongodb_connection_string
  PORT=5000
  ```

4. Start the server:
    npm start

The API server will start running on http://localhost:5000.

## API Endpoints

- `POST /register`: User registration.
- `POST /login`: User login.
- `GET /profile`: User verification.
- `POST /logout`: User logout.
- `POST /post`: Create a new post.
- `PUT /post`: Update a post.
- `GET /post`: Get all post data for the homepage.
- `GET /post/:id`: Get a particular post by ID.

## Technologies Used

- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens)
- Multer (for file uploads)
- bcrypt (for password hashing)
- cookie-parser
- fs (file system)
- cors (Cross-Origin Resource Sharing)

## Deployment

    You can access my Blog API in the following link [MyBlog](https://myblog-app-api.onrender.com/) 
