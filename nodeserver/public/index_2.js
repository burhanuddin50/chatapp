let file=document.getElementById("file");
let blah=document.getElementById("php");
file.onchange = () => {
    const [files] = file.files  ;
    if (files) {
      blah.src = URL.createObjectURL(files)
    }
  }