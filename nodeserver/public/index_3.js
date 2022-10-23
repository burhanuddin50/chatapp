let file=document.getElementById("file");
let blah=document.getElementById("php");
file.onchange = () => {
    const [files] = file.files  ;
    if (files) {
      blah.src = URL.createObjectURL(files)
    }
  }

  document.getElementById("crt_1").onclick=function (){
    document.querySelector('.grp').innerHTML+=`<div class="grps">
    <span>Fun Talk!</span>
    <button type="submit">Join!</button>
    </div>`;
};

