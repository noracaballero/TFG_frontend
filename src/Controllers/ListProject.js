const XLSX = require('xlsx');
const fs = require('fs');

function getSubjects(){
    const selected_subject = document.getElementById("select_subject")
    console.log(selected_subject);

    fetch("http://localhost:8092/subject",{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    }).then(data =>{
        console.log(data);

        data.forEach(function(element) {
            console.log(element)
            const option = document.createElement("option")
            option.text=element;
            selected_subject.add(option);
        })
    })
}
function getProjects(){

    const url = new URL("http://localhost:8092/projects");
    console.log(url)

    fetch(url, {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        console.log(response)
        return response.text();
    }).then(async data => {
        const table_body = document.getElementById("taula_body");
        table_body.innerHTML = '';

        //console.log(data);
        const table = document.getElementById("table_proj")
        const jsonData = JSON.parse(data);
        //const proyectosJson =  data.json();

        console.log(jsonData);
        const promises = [];
        for (const key in jsonData) {
            let students_git = [];
            let students_taiga =[];
            //console.log(key)
            if (jsonData.hasOwnProperty(key)) {
                let github_correct = false;
                let taiga_correct = false;
                const orgsName = getNameGithub(jsonData[key]["urlGithub"]);
                const taigaNames = jsonData[key]["urlTaiga"];
                let id_project;
                const parts = taigaNames.split('/');

                const projectsIndex = parts.indexOf('project');

                if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
                    const projectID = parts[projectsIndex + 1];
                    id_project=projectID;
                    console.log('ID del proyecto:', projectID);
                } else {
                    console.log('No se pudo extraer el ID del proyecto');
                }
                const url_s = new URL("http://localhost:8092/students/project");
                var name = jsonData[key]["name"];
                var subject = jsonData[key]["subject"];
                url_s.searchParams.append('name',name);
                url_s.searchParams.append('subject',subject);

                fetch(url_s,  {
                    method:'GET',
                }).then(response =>{
                    if (!response.ok) {
                        throw new Error("Error sending form");
                    }
                    return response.text()
                }).then(dataS => {
                    const jsonData = JSON.parse(dataS);
                    console.log(jsonData);

                    const table_body = document.getElementById("table_body");

                    console.log(jsonData);
                    const promises = [];
                    for (const key in jsonData) {
                        if (jsonData.hasOwnProperty(key)) {
                            students_git.push(jsonData[key]["username_github"]);
                            students_taiga.push(jsonData[key]["username_taiga"]);
                        }




                    }

                }).catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar el formulario');
                });

                const url=new URL("http://localhost:8092/subject/token");
                url.searchParams.append('name',jsonData[key]["subject"]);
                //console.log(url);
                fetch(url, {
                    method: 'GET',
                })
                    .then(response => {
                        if (!response.ok) {

                            throw new Error("Error sending form");
                        }
                        // Devolver la promesa de response.text() para manejarla en el siguiente then
                        return response.text();
                    })
                    .then(token => {
                        //console.log(token);
                        fetch(`https://api.github.com/orgs/${orgsName}/members`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `token ${token}`
                            }
                        })
                            .then(async response => {
                                if (response.status === 404) {
                                    github_correct=false;
                                    table_body.innerHTML += "<tr style='--bs-table-bg: #f98888'  subject='" + jsonData[key]["subject"] + "' ><td name='" + jsonData[key]["name"] + "'><input type='checkbox' checked></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";
                                }
                                if (!response.ok) {
                                }
                                return await response.json();
                            })
                            .then(data => {

                                if (Array.isArray(data) && data.length === 0) {
                                    //console.log('La respuesta está vacía');
                                    github_correct=false;


                                } else {

                                    console.log(students_git);
                                    //console.log(jsonData);
                                    let exists = existsUsername(students_git, data);
                                    if(!exists) github_correct=false;
                                    else github_correct=true;
                                    //console.log('La respuesta no está vacía');

                                }
                                const url_taig=new URL("https://api.taiga.io/api/v1/projects/by_slug");
                                url_taig.searchParams.append('slug',id_project);
                                console.log(url_taig);

                                fetch(url_taig, {
                                    method: 'GET',
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            /*label.classList.remove('is-invalid');
                                            label.classList.add('is-valid');
                                            messagetaiga.style.display = 'none';*/
                                            taiga_correct=true;
                                            //return true;

                                        } else if (response.status === 401) {
                                            /*label.classList.add('is-invalid');
                                            messagetaiga.style.display = 'block';*/
                                            taiga_correct=false;
                                            //return false;
                                        }
                                        console.log(github_correct);
                                        console.log(taiga_correct);
                                        if(github_correct && taiga_correct){
                                            console.log("VERDEEEE");
                                            table_body.innerHTML += "<tr style='--bs-table-bg: #c6e6b8' class='row-green' name='" + jsonData[key]["name"] + "' subject='" + jsonData[key]["subject"] + "' ><td><input type='checkbox' checked></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";

                                        }else{
                                            console.log("ROJOOOO");
                                            table_body.innerHTML += "<tr style='--bs-table-bg: #f98888' name='" + jsonData[key]["name"] + "' subject='" + jsonData[key]["subject"] + "' ><td><input type='checkbox' checked></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";

                                        }

                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                        taiga_correct=false;

                                    });
                                console.log(github_correct);
                                console.log(taiga_correct);

                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });


                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Hubo un error al enviar el formulario');
                    });
                }
        }

        console.log(table_body)
        var rows = table.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; ++i) {
            rows[i].addEventListener("click", function () {
                const name = this.getAttribute("name");

                console.log("holssss" + name);
                const subject = this.getAttribute("subject");
                openProjectWindow(name, subject);
            })
        }
        table.addEventListener("click",function (event){
            console.log("adeuuuu");
            var target = event.target;
            console.log(target.tagName)
            if(target.tagName==="TD"){
                var row = target.closest("tr");
                if (row) {
                    const name = row.getAttribute("name");
                    console.log(name);
                    const subject = row.getAttribute("subject");
                    openProjectWindow(name, subject);
                }

            }
        })

    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
}
function renameKey(obj, oldKey, newKey){
    obj[newKey]=obj[oldKey];
    delete obj[oldKey];
}
function import_p(){
    const finalObject = {};
    var fileInput = document.getElementById("formFile");
    const selectedFile = fileInput.files[0];
    console.log(selectedFile.name);

    const subject_value = document.getElementById("select_subject").value;



    const reader = new FileReader();

    reader.onload = function (event ) {
        console.log("File successfully loaded!");
        const arraybuff = event.target.result;
        const data = new Uint8Array(arraybuff);
        console.log(data);

        const workbook = XLSX.read(data,{type: 'array'});
        console.log(workbook);
        const sheetName = workbook.SheetNames[0];
        console.log(sheetName);
        const worksheet = workbook.Sheets[sheetName];
        console.log(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const info = jsonData.map(renameParameter);
        //console.log(info);
        const members = jsonData.map(extractMember1Params);
        //console.log(member);

        const jsonProject = info.map(obj => {
            return {...obj, subject: subject_value};
        });
        const jsonStudent = members.map(obj => {
            return {...obj, subject: subject_value};
        });
        console.log(jsonProject);
        console.log(jsonStudent);

        fetch("http://localhost:8092/projects", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(jsonProject)
        }).then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error("Error sending form");
            }
            alert('Formulario enviado exitosamente');
            fetch("http://localhost:8092/students", {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(jsonStudent)
            }).then(response => {
                console.log(response)
                if (!response.ok) {
                    throw new Error("Error sending form");
                }
                alert('Formulario enviado exitosamente');

            }).catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el formulario');
            });
        }).catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario');
        });
        //getProjects();



        const project = jsonData.map(infoProject);


        //console.log(jsonData);
    }

    reader.readAsArrayBuffer(selectedFile);

}//);

function existsUsername(usernames,json){
    console.log("AAAAA")
    for (let name in usernames){
        console.log(usernames[name])
        let found = false;
        for(let key in json){
            console.log(json[key].login);
            //console.log(json[key]["login"])
            if(json[key]["login"] === usernames[name]){
                found = true;
                break;
            }
        }
        if(!found){
            return false;
        }
    }
    return true;
}

document.addEventListener("DOMContentLoaded",function (){
    console.log("Holaaa");
    getProjects();
    const table = document.getElementById("taula_body");
    console.log(table)
    table.addEventListener("click",function (event){
        console.log("adeuuuu");
        var target = event.target;
        if(target.tagName==="tr"){
            console.log(target.dataset.name)
            const name = this.getAttribute("name");
            console.log(name);
            const subject = this.getAttribute("subject");
            openProjectWindow(name,subject);
        }
    })

});

function openProjectWindow(name,subject){

    const windowProject = window.open("InfoProject.html","_blank");
    windowProject.onload = function() {
        windowProject.document.getElementById("name").value = name;
        windowProject.document.getElementById("subject").value = subject;
        windowProject.getInfoProject(name,subject);
    };
}

function infoProject(obj){
    const info= {};
    for(const key in obj){
        if(key.startsWith('Identificador') || key.startsWith('URL del projecte Taiga')|| key.startsWith('URL de la vostra organització a GitHub')){
            info[key]=obj[key];
        }
    }
    return info;
}

function extractMember1Params(obj) {

    let currentMember = 1;
    const newOBj = {};
    Object.keys(obj).forEach(key => {
        if(key.startsWith("Identificador")){
            newOBj["name"]=obj[key];
        }
    });

    while (true) {
        const memberPrefix = `Membre #${currentMember}:`;
        const nameKey = `${memberPrefix} Nom i Cognoms`;
        const githubKey = `${memberPrefix} username a Github`;
        const taigaKey = `${memberPrefix} username a Taiga`;

        if (!(nameKey in obj && githubKey in obj && taigaKey in obj)) {
            break; // No more members
        }

        // Create member object
        const member = {
            name: obj[nameKey],
            githubUsername: obj[githubKey],
            taigaUsername: obj[taigaKey]
        };

        // Add member object to newObject
        if (!newOBj.members) {
            newOBj.members = [];
        }
        newOBj.members.push(member);

        currentMember++;
    }
    return newOBj;
}
function renameParameter(obj){
    const newOBj = {};

    Object.keys(obj).forEach(key => {
        if(key.startsWith("Identificador")){
            newOBj["name"]=obj[key];
        }
        else if(key.startsWith("URL de la vostra organització a GitHub")){
            newOBj["urlGithub"]=obj[key];
        }
        else if(key.startsWith("URL del projecte Taiga")){
            newOBj["urlTaiga"]=obj[key];
        }
    });

    return newOBj;
}

function configurateProject(){

    var table = document.getElementById("table_proj");
    var rows = table.getElementsByTagName("tr");
    const url=new URL("http://localhost:8092/config");


    var list

    for(var i =1; i < rows.length; ++i){
        var row = rows[i];
        console.log(row);
        var element = row.getElementsByTagName("td");
        var projects = {};

        var selected = element[0].querySelector('input[type="checkbox"]');
        if(selected.checked){
            var coma =",";
            console.log(coma)
            //coma = decodeURIComponent(coma);
            var data = element[1].innerText+","+element[2].innerText;

            url.searchParams.append('project'+i,data);
            console.log(element[1].innerText);
            console.log(element[2].innerText);
        }
        console.log(element[0].innerText);
    }
    console.log(url);

    fetch(url, {
        method: 'GET',

    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        console.log(response)
        return response.json();
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar los proyectos');
    });
}
function getNameGithub(url_g){
    const projectLink = url_g;
    let id_project;
    const parts = projectLink.split('/');

    const projectsIndex = parts.indexOf('github.com');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        console.log(parts[projectsIndex + 1]);
        return parts[projectsIndex + 1];
    } else {
        console.log('No se pudo extraer el ID del proyecto');
    }
}
//Validació github
/*function  isValidGithub(url_git,subject){

    const orgsName = getNameGithub(url_git);
    console.log()

    console.log("weweweweew"+url_git);

    const label = document.getElementById('github_url');
    const messagetaiga = document.getElementById('invalid-feedback-div-git');

    const url=new URL("http://localhost:8092/subject/token");
    url.searchParams.append('name',subject);
    console.log(url);
    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error sending form");
            }
            // Devolver la promesa de response.text() para manejarla en el siguiente then
            return response.text();
        })
        .then(token => {
            console.log(token);
            fetch(`https://api.github.com/orgs/${orgsName}/members`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`
                }
            })
                .then(async response => {
                    if (response.status === 404) {
                        return "false";
                        //throw new Error('Error 404: Recurso no encontrado');
                    }
                    if (!response.ok) {

                        //throw new Error('Error al obtener los datos de la membresía');
                    }

                    return await response.json();
                })
                .then(data => {

                    if (Array.isArray(data) && data.length === 0) {
                        console.log('La respuesta está vacía');
                        return "false";

                    } else {
                        console.log('La respuesta no está vacía');
                        return "true";

                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return "false";
                });
        })
        .catch(error => {
            return false;
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario');
        });
}*/