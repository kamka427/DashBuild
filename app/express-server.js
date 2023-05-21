import { handler } from './build/handler.js';
import express from 'express';

const app = express();

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

app.use(express.static('static'));

app.use(handler);

app.listen(80, () => {
	console.log('listening on port 3000');
});
