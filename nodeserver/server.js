const path=require("path");
const http=require("http");
const express=require("express");
const socketio=require("socket.io");
const passport = require("passport");
const session = require('express-session');
const mongoose=require('mongoose');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const GOOGLE_CLIENT_ID="883345413583-pje0k3gtrlpis2124f8ah75t8gb4hod9.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET="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";
main().catch(err=> console.log(err));
async function main(){
   await mongoose.connect('mongodb://localhost/chatapp');
}
const chatSchema=new mongoose.Schema({
   name : String,
   message : String
})
const chats=mongoose.model('chats',chatSchema);
let name;
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      name=profile.displayName;
      return done(null,profile);
  }
));
passport.serializeUser((user,done)=>{
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});
function isLoggedIn(req,res,next){
     req.user?next():res.sendStatus(401);
}
const app=express();
app.use(session({ secret: 'cat' ,resave: true,
saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
const server=http.createServer(app);
const io=socketio(server);
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname+'/views/inside.html'));
})
app.get('/google',passport.authenticate('google',{scope:['email','profile']}));
app.get('/google/callback',passport.authenticate('google',{successRedirect:'/chat',failureRedirect:'/failure'}));
app.get('/failure',(req,res)=>{
   res.send("Error");
})
app.get('/chat',isLoggedIn,(req,res)=>{
   
   res.sendFile(path.join(__dirname+'/views/index.html'));
})

const users={};
io.on('connection',socket =>{
   users[socket.id]=name;
   socket.emit('personal',users);
   socket.on('new-user-joined',() =>{
    socket.broadcast.emit('user-joined',name,users);
    
   })
   
   socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message,name: users[socket.id]});
    let chat= new chats({name:users[socket.id],message:message});
    chat.save();
   })
   socket.on('disconnect',()=>{
    socket.broadcast.emit('user-left',users[socket.id]);
    delete users[socket.id];
    socket.broadcast.emit('user-left-1',users);
   })
});
const port=8000;
server.listen(port,()=>{console.log(`Server running on port ${port}`)});