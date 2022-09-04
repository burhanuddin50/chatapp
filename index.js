const socket=io('http://localhost:8000');
const form=document.querySelector('.submitbar');
const messageinp=document.querySelector('.in');
const messagecont=document.querySelector('.container');
const name= prompt("Enter your name :");
var audio= new Audio("Notification.mp3");
socket.emit('new-user-joined',name);
const append= (message,position,user)=>{
    if(position=="left")
    {
       audio.play();
    }
     messagecont.innerHTML += `<div class="message ${position}">${user}:${message}</div>`;
    
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    append(`${messageinp.value}`,"right","You");
    socket.emit('send',`${messageinp.value}`);
    messageinp.value='';
    messagecont.scrollTop = messagecont.scrollHeight;
})
socket.on('user-joined',name =>{
        append("Joined the chat","left",`${name}`);
})
socket.on('receive',data=>{
    append(`${data.message}`,"left",`${data.name}`);
})
socket.on('user-left', user=>{
    append("Left the chat","left",`${user}`);
})
