// Import the handler function from the build/handler.js file
import { handler } from './build/handler.js';

// Import the express module
import express from 'express';

// Create an instance of the express application
const app = express();

// Serve static files from the static directory
app.use(express.static('static'));

// Use the handler function for all other requests
app.use(handler);

// Start the server and listen on port 80
app.listen(80, () => {
	console.log('listening on port 80');
});
