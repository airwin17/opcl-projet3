
var categories;
var works;
var cimage;
var token=sessionStorage.getItem("tokenstore");
var server = "http://localhost:5678/api/";
var reader = new FileReader();
var defaultimg = "assets/icons/Gr.png";
var state = {
    cmsmode: false,
    login: false,
    cmsworks: false,
    cmsworkconfirm: false,
    errordiv:false,
    errormessasge:"",
    set seterrordiv(st){
        if(st==false){
            get("#error-div").style.display="none";
            get("div#blsc-div").style.display = "none";
            get("body").style.overflow = 'scroll';
            get("#edit-mode").addEventListener('click',switchworks);
        }else{
            get("#edit-mode").removeEventListener('click',switchworks);
            get("#error-div").style.display="block";
            get("div#blsc-div").style.display = "block";
            get("body").style.overflow = 'hidden';
        }
        this.errordiv=st;
    },
    set setmessage(st){
        this.errormessasge=st;
    },
    set setlogin(st) {
        if (st == true) {
            get("#mainp").style.display = "none";
            get("#login-div").style.display = "block";
            this.login = true;
        } else {
            get("#mainp").style.display = "block";
            get("#login-div").style.display = "none";
            this.login = false;
        }
    },
    set setcmsworks(st) {
        if (st == true) {
            refrech();
            get("div#modifier-div").style.display = "none";
            get("div#modifier-div2").style.display = "none";
            get("div#showedit-div").style.display = "grid";
            get("div#blsc-div").style.display = "block";
            get("body").style.overflow = 'hidden';
            this.cmsworks = true;
        } else {
            get("body").style.overflow = 'scroll';
            get("div#modifier-div").style.display = "flex";
            get("div#modifier-div2").style.display = "flex";
            get("div#showedit-div").style.display = "none";
            get("div#blsc-div").style.display = "none";
            this.cmsworks = false;
        }
    },
    set setcmsworkconfirm(st) {
        if (st == true) {

            get("div#edit-div").style.display = "grid";
            get("div#showedit-div").style.display = "none";
            this.cmsworkconfirm = true;
        } else {
            get("#inputfile").value = "";
            cimage=null;
            get("input#work-ttl-input").value = "";
            get("div#edit-div").style.display = "none";
            get("div#showedit-div").style.display = "grid";
            this.cmsworkconfirm = false;
        }
    },
    set setcmsmode(st) {
        if (st == true) {
            get("div#modifier-div").style.display = "flex";
            get("div#modifier-div2").style.display = "flex";
            get("div#header-edit-div").style.display = "flex";
            get("nav#nav-cat").style.display = "none";
            get("#loginbut").innerHTML="logout";
        } else {
            get("div#modifier-div").style.display = "none";
            get("div#modifier-div2").style.display = "none";
            get("div#header-edit-div").style.display = "none";
            get("nav#nav-cat").style.display = "flex";
            get("#loginbut").innerHTML="login";            
        }
    }
}
if(token!=null){
    state.setcmsmode=true;
    console.log(token)
}
//refrech cmsworks
async function refrech() {
    try {
        const response = await fetch(server + "works", {
            method: "GET"
        })
        works = await response.json();

        get("div#workeditlist").innerHTML = "";
        get(".gallery").innerHTML = "";
        for (var i = 0; i < works.length; i++) {
            get("div#workeditlist").innerHTML += `
            <div class="singleworkscontainer" id="${works[i].id}">
                <div class="singlework" style="background: 0 0/100% no-repeat url(${works[i].imageUrl});">
                    <button class="remworks" onclick="removework(${works[i].id})">
                        <img src="assets/icons/cobeille.png">
                    </button>
                </div>
            <p class="edittxtbut">éditer</p>
            </div>`;
            get(".gallery").innerHTML +=
                `<figure class="singwork" id="workcat${works[i].category.id}">
                <img src="${works[i].imageUrl}" alt="${works[i].title}">
                <figcaption>${works[i].title}</figcaption>
            </figure>`;
        }
    } catch {
        alert("works faild to load")
    }
}
reader.onload = function (e) {
    get("img#kkkllghxtxfu").src = e.target.result;
    get("img#kkkllghxtxfu").style.height = "100%";
};
// stat of valider button
function buttonstate(st) {
    if (st == true) {
        get("#submiter").disabled = false;
        get("#submiter").style.backgroundColor = "#1D6154";
    } else {
        get("#submiter").disabled = true;
        get("#submiter").style.backgroundColor = "#A7A7A7";
    }
}
//remove work
async function removework(tid) {
    try {
        const response = await fetch(server + `works/${tid}`, {
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            refrech();
        }
    } catch {
        alert('delete failed')
    }
}

refrech();
loadcategories();
buttonstate(false);
//state.setcmsmode=true;
/*state.setcmsworks=true;
state.setcmsworkconfirm=true;*/
state.seterrormessasge="this is error message";
state.seterrordiv=false;
//fonction de tri
function trier(id) {
    var doc = document.querySelectorAll(".singwork");
    if (id == "al") {
        for (var i = 0; i < doc.length; i++) {
            doc[i].style.display = 'block';
        }
    } else {

        for (var i = 0; i < doc.length; i++) {
            if (doc[i].id == `workcat${id}`) {
                doc[i].style.display = "block";
            } else {
                doc[i].style.display = "none";
            }
        }
    }
}
//load categories
async function loadcategories() {
    try {
        const response = await fetch(server + 'categories');
        categories = await response.json();
        for (var i = 0; i < categories.length; i++) {
            get("#workscombobox").innerHTML +=
                `<option value="${categories[i].id}">${categories[i].name}</option>`;
            get("#nav-cat").innerHTML +=
                `<div class="cat" onclick="trier(${categories[i].id})">
            <p>${categories[i].name}</p>
        </div>`;
        }

    } catch (error) {
        alert("loadindind faild check internet connection")
    }
}
//check form validity
async function checkerworks() {
    if(get("#inputfile").files.length>0){
        if (get("#inputfile").files[0].size <= 4097152) {
            
            var readers=new FileReader();
                readers.onload = function (e) {
                    get("img#kkkllghxtxfu").src = e.target.result;
                    get("img#kkkllghxtxfu").style.height = "100%";
                };
                readers.readAsDataURL(get("#inputfile").files[0]);
                cimage=await fileToBinaryString(get("#inputfile").files[0]);
            if (get("input#work-ttl-input").value != "" && get("input#work-ttl-input").checkValidity()) {
                
                //cimage=await fileToBinaryString(get("#inputfile").files[0]);
                buttonstate(true);
            } else {
                buttonstate(false);
            }
        } else if (get("#inputfile").files[0].size > 4097152) {
            alert("File is too big!");
            get("#inputfile").value = "";
            return false;
        }
    }
}


function get(selector) {
    return document.querySelector(selector);
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const read = new FileReader();
        read.readAsDataURL(file);
        read.onload = () => resolve(reader.result);
        read.onerror = error => reject(error);
    });
}
async function fileToBinaryString(file) {
    var reader1 = new FileReader();
    // Retourner une nouvelle promesse
    return new Promise((resolve, reject) => {
      // Lire le fichier comme une chaîne binaire
      reader1.readAsBinaryString(file);
      // Quand la lecture est terminée, résoudre la promesse avec le résultat
      reader1.onloadend = () => {
        resolve(reader1.result);
      };
      // En cas d'erreur, rejeter la promesse avec l'erreur
      reader1.onerror = (error) => {
        reject(error);
      };
    });
}
//********************************************************************************************************
//get("#edit-mode").addEventListener('click',switchworks);
get("#croix").addEventListener('click',switchworks);
get("#loginbut").addEventListener('click',tologin);
get("#croixi").addEventListener('click',backtocms);
get("#log-subbut").addEventListener('click',trytologin);
get("#addphoto").addEventListener('click',addworkform);
get("#arrawback").addEventListener('click',backfromeditdiv);
get("#work-ttl-input").addEventListener('change',checkerworks);
get("#inputfile").addEventListener('change',checkerworks);
get(".cat").addEventListener('click',()=>{
    trier('al')
});
get("#error-div button").addEventListener('click',function(){
    state.seterrordiv=false;
});

/*get("#").addEventListener('click', function (){
    state.setcmsworkconfirm = false;
    if (state.cmsworks == false) {
        state.setcmsworks = true;
    } else {
        state.setcmsworks = false;
    }
});*/

//***********************************************************************************************************
function tologin(){
    if(token!=null){
        token=null;
        sessionStorage.removeItem("tokenstore");
        state.setcmsmode=false;
    }else{
        if (state.login == true) {
            state.setlogin = false;
        } else {
            state.setlogin = true;
        }
    }
    
}
//croix
function switchworks(){
    state.setcmsworkconfirm = false;
    if (state.cmsworks == false) {
        state.setcmsworks = true;
    } else {
        state.setcmsworks = false;
    }
}
//#addphoto
function addworkform() {
    state.setcmsworkconfirm = true;
}
function backtocms() {//#croix arrow
    state.setcmsworkconfirm = false;
    state.setcmsworks = false;
}
function backfromeditdiv() {//#arrawback
    state.setcmsworkconfirm = false;
    get("img#kkkllghxtxfu").src = defaultimg;
    get("img#kkkllghxtxfu").style.height = "auto";
}
//************************************************************************************************************ */
//log-subbut
 async function trytologin() {
    var user = {
        email: get("#email-input").value,
        password: get("#mdp-input").value
    }
    try {
        /*fetch(server + "users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then((res)=>{
            return res.json();
        })
        .then(res=>{
            tologin();
            state.setcmsmode = true;
            trier("al");
            sessionStorage.setItem("tokenstore",res.token);
            token=sessionStorage.getItem("tokenstore");
        }).catch(error => {get("#mdpfaux").style.display = "block"});*/
/************************************************************************************************* */
        const res = await fetch(server + "users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        if (res.ok) {
            tologin();
            state.setcmsmode = true;
            trier("al");
            token = await res.json();
            sessionStorage.setItem("tokenstore",token.token);
        } else {
            get("#mdpfaux").style.display = "block";
        }
    } catch (error) {
        alert("failed check internet connection");
    }
}

async function trytocreateworks() {
    
    try {
        var inputworks = {
            image: get("#inputfile").files[0],
            title: get("#work-ttl-input").value,
            category: parseInt(get("select#workscombobox").value)
        }
        var formdata = new FormData();
        for(let key in inputworks){
            formdata.append(key ,inputworks[key])
        }
        const response = await fetch("http://localhost:5678/api/works",
            {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                    //'Content-Type':'multipart/form-data'
                },
                body: formdata
            
        });
        refrech();
        state.setcmsworkconfirm=false;
        state.setcmsworks=true;
    } catch (error) {
        state.seterrordiv=true;
        state.setmessage=error;
        //throw new Error("Something went badly wrong!");
    }
    
}
