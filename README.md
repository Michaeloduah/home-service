# Fiverr Clone

This project is a Full Stack MERN (MongoDB, Express, React, Node.js) application that serves as a clone of the popular platform Fiverr. It allows users to act as sellers or buyers, offering and purchasing various services. The application includes role-based access, login authentication using JWT, React-Query, gig filtering, Stripe payment integration, and a messaging system.

## Features

- **Role Based Access**: The application supports two main roles - "seller" and "user". Sellers can create and offer services, while users can browse and purchase services.

- **Login Authentication with JWT**: Secure user authentication is implemented using JSON Web Tokens (JWT). Users can log in securely and access their respective roles and functionalities.

- **React Query Reducer**: The application utilizes React Query for asynchronus state management. This enhances performance by caching and updating data seamlessly, providing a smooth user experience.

- **Gig Filter**: A filtering mechanism is in place to help users find the desired services quickly. Filtering can be based on categories, price ranges.

- **Gig Review**: Users can review the gigs by providing.

- **Stripe Payment Integration**: The integration of the Stripe payment gateway enables secure and convenient payment processing for users purchasing services.

- **Messaging System**: The application includes a messaging feature that allows sellers and users to communicate effectively regarding services, requirements, and other details.

## Installation

1. Clone the repository: `git clone https://github.com/VighneshManjrekar/fiverr-clone`
2. Navigate to the project directory: `cd fiverr-clone`
3. Install server dependencies: `cd server && yarn`
4. Install client dependencies: `cd ../client && yarn`
5. Set up environment variables:
   - Rename a `.env.env` to `.env` file in the `server` directory for server-related variables.
   - Replace cloudinary links in the `client/src/utils/upload.utils.js` directory with your own cloudinary link.
6. Start the server: In the `server` directory, run `npm run dev` or `yarn dev`.
7. Start the client: In the `client` directory, run `npm run dev` or `yarn dev`.

## Usage

- Access the application at `http://localhost:5173/` in your web browser.
- Register as a user or seller and log in with your credentials.
- Browse through available services, apply filters, and view details.
- Purchase services using the integrated Stripe payment system.
- Utilize the messaging system to communicate with sellers or users.

## Demo

[<img src="./client//public//img/demo.png" width="800"/>](https://youtu.be/gBrrWajSABY)
click to watch demo on youtube