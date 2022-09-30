const socket=io('http://localhost:8000');
const form=document.querySelector('.submitbar');
const messageinp=document.querySelector('.in');
const messagecont=document.querySelector('.container');
var speechRecognition=window.webkitSpeechRecognition;
const recognition =new speechRecognition();
recognition.continuous=true;
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
    recognition.stop();
    document.querySelector(".end").style.display="none";
})
  
socket.on('user-joined',(name,users,photos)=>{
        append("Joined the chat","left",`${name}`);
        document.querySelector(".only-users").innerHTML="";
       Object.keys(photos).forEach(element => {
      document.querySelector(".only-users").innerHTML+=`<div class="use"><img src="${photos[element]}" alt="" srcset="" id="pht"><span  id="text_u">${users[element]}</span></div>`;
        
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
      document.querySelector(".only-users").innerHTML+=`<div class="use"><img src="${photos[element]}" alt="" srcset="" id="pht"><span  id="text_u">${users[element]}</span></div>`;
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
document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".users").style.display="none";
    document.querySelector(".dt").style.display="block";
})
document.querySelector(".dt").addEventListener("click",()=>{
    document.querySelector(".users").style.display="block";
    document.querySelector(".dt").style.display="none";
})
document.querySelector(".vc").addEventListener("click",()=>{
    recognition.start();
    document.querySelector(".end").style.display="block";
})
document.querySelector(".end").addEventListener("click",()=>{
    recognition.stop();
    document.querySelector(".end").style.display="none";
})
recognition.addEventListener("result",(event)=>{
    messageinp.value+=`${event.results[event.resultIndex][0].transcript}`;
})
document.getElementById("drk").addEventListener("click",()=>{
    document.getElementById("hd").innerHTML+='<link rel="stylesheet" href="theme.css">';
    document.getElementById("lig").style.color="rgb(0,0,0)";
    document.getElementById("drk").style.color="rgb(255,0,0)";
})
document.getElementById("lig").addEventListener("click",()=>{
    document.getElementById("hd").innerHTML +='<link rel="stylesheet" href="style.css">';
    document.getElementById("drk").style.color="rgb(0,0,0)";
    document.getElementById("lig").style.color="rgb(255,0,0)";
})