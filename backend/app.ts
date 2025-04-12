import 'dotenv/config';
import express from 'express';
import connectDB from './config/dbConnector';
import auth from './routes/api/auth';
import siren from './routes/api/siren';
import district from './routes/api/district';
import config from 'config';
import cors from 'cors';
import socketManager, { controllerRouter } from './sockets/socketManager';
import * as http from 'http';

const PORT = config.get('serverPort');

//TODO: Integrate testing!

//**********************************Inits**********************************/
const app = express();
const server = http.createServer(app);

app.use(express.json());
connectDB();
app.use(cors());

//**********************************Routes**********************************/
app.use('/api/auth', auth);
app.use('/api/sirens', siren);
app.use('/api/districts', district);
app.use('/api/controller', controllerRouter);
socketManager.init(server);

server.listen(PORT, () => {
	console.log('Go! ' + PORT);
});
