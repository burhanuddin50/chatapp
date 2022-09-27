const socket=io('http://localhost:8000');
const form=document.querySelector('.submitbar');
const messageinp=document.querySelector('.in');
const messagecont=document.querySelector('.container');
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
  
socket.on('user-joined',(name,users,photos)=>{
        append("Joined the chat","left",`${name}`);
        document.querySelector(".only-users").innerHTML="";
       Object.keys(photos).forEach(element => {
      document.querySelector(".only-users").innerHTML+=`<div class="use"><img src="${photos[element]}" alt="" srcset="" id="pht">${users[element]}</div>`;
        
    });
})
socket.on('personal',(users,photos)=>{
   document.querySelector(".only-users").innerHTML="";
       Object.keys(photos).forEach(element => {
      document.querySelector(".only-users").innerHTML+=`<div class="use"><img src="${photos[element]}" alt="" srcset="" id="pht"><span  id="text_u">${users[element]}</span></div>`;
      
         });
    }) 
socket.on('receive',data=>{
    append(`${data.message}`,"left",`${data.name}`);
})
socket.on('user-left', user=>{
    append("Left the chat","left",`${user}`);
})
socket.on("user-left-1",(users,photos)=>{
    document.querySelector(".only-users").innerHTML="";
       Object.keys(photos).forEach(element => {
      document.querySelector(".only-users").innerHTML+=`<div class="use"><img src="${photos[element]}" alt="" srcset="" id="pht" ><span class="txt"> ${users[element]}</span></div>`;
})})
document.querySelector(".drop").addEventListener("click",()=>{
    if(document.getElementById("menu-drop").style.display==="none"){
    document.getElementById("menu-drop").style.display="block";
     }
    else{
    document.getElementById("menu-drop").style.display="none";
    }
})

document.getElementById("clr").addEventListener("click",()=>{
    messagecont.innerHTML ="";
})