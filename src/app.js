import express from "express";
import { initialize } from './models';
import routes from './routes';
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http'
import socketIO from 'socket.io'

const app = express();
const server = http.createServer(app)
const io = socketIO(server, {
    cors: 'http://localhost:3000', // use .env variable
})
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/routes', routes)

const db = initialize().then((db) => {
  db.sequelize.sync({force:false});
}).catch((err) => {
  console.log(err.message)
})

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Hello Chat app users`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({status: statusCode, error: err.message });
});

// not found url
app.use('*', (req, res) => res.status(404).json({status:404, error:'url Not found 404'}));

io.on('connection', socket =>{
    console.log('client connected: ' + socket.id)
    socket.join('default-room')
    socket.on('disconnect', reason => {
        console.log(reason)
    })
})

setInterval(() =>{
    io.to('default-room').emit('time', new Date())
}, 5000)

const PORT = process.env.PORT || 4200;
server.listen(PORT, (err) => {
    if(err) console.log(err)
  console.log(`server up and running on port ${PORT}`);
});