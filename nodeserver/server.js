const path= require("path");
const http= require("http");
const express= require("express");
const socketio=require("socket.io");
const fileupload= require('express-fileupload');
const session = require('express-session');
const mongoose=require('mongoose');
const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const cloudinary= require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dktlajkeq', 
    api_key: '689961335275927', 
    api_secret: 'YKkBsJnxlNi97t4OvWiEw9Kt1BI',
    secure: true
  });
  const GOOGLE_CLIENT_ID="883345413583-pje0k3gtrlpis2124f8ah75t8gb4hod9.apps.googleusercontent.com";
  const GOOGLE_CLIENT_SECRET="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";
  passport.use(new GoogleStrategy({
      clientID:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/google/callback",
      passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
  
        email_1=profile.email;
        isVerify=profile.email_verified;
        name_1=profile.displayName;
        return done(null,profile);
    }
  ));
  passport.serializeUser((user,done)=>{
      done(null,user);
  });
  passport.deserializeUser((user,done)=>{
      done(null,user);
  });
  main().catch(err=> console.log(err));
  async function main(){
     await mongoose.connect('mongodb://localhost/chatapp');
  }
  const userSchema=new mongoose.Schema({
      name: String,
      email:String,
      verified:String,
      photo_url :String
   })
   const chatSchema=new mongoose.Schema({
      name : String,
      message : String
   })
   const chats=mongoose.model('chats',chatSchema);
   const users_info=mongoose.model('users',userSchema);
const port=8000;
let name_1,email_1,isVerify;
const users={};
const photos={};
function isLoggedIn(req,res,next){
     req.user?next():res.sendStatus(401);
}
const app=express();
app.use(session({ secret: 'cat' ,resave: true,
saveUninitialized: true }));
app.use(fileupload({
   useTempFiles:true
}));
app.use(passport.initialize());
app.use(passport.session());
const server=http.createServer(app);
const io=socketio(server);
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
   res.sendFile(path.join(__dirname+'/views/inside.html'));
})
let photourl;
app.post('/',(req,res)=>{
         
        res.redirect('/google');
         
})
app.get('/google',passport.authenticate('google',{scope:['email','profile']}));
app.get('/google/callback',passport.authenticate('google',{successRedirect:'/group',failureRedirect:'/failure'}));
app.get('/failure',(req,res)=>{
   res.send("Error");
});
app.get('/group',isLoggedIn,(req,res)=>{
   res.sendFile(path.join(__dirname+'/views/group.html'));
})
app.post('/group',(req,res)=>{
   if(req.files.phto===null)
   {
      photourl="main-qimg-2b21b9dd05c757fe30231fac65b504dd.webp";
   }
   else{
      cloudinary.uploader.upload(req.files.phto.tempFilePath,(err,result)=>{
      photourl=result.url;
     });
    }
   setTimeout(()=>{res.redirect('/chat');},1000);
})
app.get('/chat',isLoggedIn,(req,res)=>{
   res.sendFile(path.join(__dirname+'/views/index.html'));
});
io.on('connection',socket =>{
   
   if(name_1!=null){
   let users_1=new users_info({name:name_1,email:email_1,verfied:isVerify,photo_url:photourl});
   users_1.save();}
   users[socket.id]=name_1;
   photos[socket.id]=photourl;
   socket.emit('personal',users,photos);
   socket.on('new-user-joined',() =>{
   socket.broadcast.emit('user-joined',name_1,users,photos);
   })
   
   socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message,name: users[socket.id]});
    let chat= new chats({name:name_1,message:message});
    chat.save();
   }) 
   socket.on('disconnect',()=>{
    socket.broadcast.emit('user-left',users[socket.id]);
    delete users[socket.id];
    delete photos[socket.id];
    socket.broadcast.emit('user-left-1',users,photos);
   })
});
server.listen(port,()=>{console.log(`Server running on port ${port}`)});