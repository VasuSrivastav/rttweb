import express from 'express';
import { createServer } from "http";
import path from 'path';
import { Server } from "socket.io";

const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server);
// Middleware for static files and EJS templates
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('hello.ejs');
});


io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  
    socket.on("send-Location", (data) => {
      console.log("Location received", data.latitude, data.longitude);
      io.emit("receive-Location", { id: socket.id, ...data }); // send the location to all connected clients including the sender itself and the sender's id is also sent
    });
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
      io.emit("user-disconnected", socket.id);
    });
  });
  
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
