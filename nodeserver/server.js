const path=require("path");
const http=require("http");
const express=require("express");
const socketio=require("socket.io")
const app=express();
const server=http.createServer(app);
const io=socketio(server);
app.use(express.static(path.join(__dirname,'public')));
const users={};
io.on('connection',socket =>{
   socket.on('new-user-joined',name =>{
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
   })
   socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message,name: users[socket.id]});
   })
   socket.on('disconnect',()=>{
    socket.broadcast.emit('user-left',users[socket.id]);
    delete users[socket.id];
   })
});
const port=8000;
server.listen(port,()=>{console.log(`Server running on port ${port}`)});