const mongoose=require('mongoose');
main().catch(err=> console.log(err));
async function main(){
   await mongoose.connect('mongodb://localhost/chatapp');
}
const userSchema=new mongoose.Schema({
    name: String ,
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