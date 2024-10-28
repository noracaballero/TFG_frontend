const XLSX = require('xlsx');
const fs = require('fs');
let configs = [];
let sub_config
function getSubjects(){
    const selected_subject = document.getElementById("select_subject")


    fetch("http://"+process.env.SERVER+":8092/subject",{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    }).then(data =>{
        //console.log(data);
        const name = data.name;


        data.forEach(function(element) {
            console.log(element.name)
            const option = document.createElement("option")
            option.text=element.name;
            selected_subject.add(option);
        })
    })
}
function getProjects(){

    const url = new URL("http://"+process.env.SERVER+":8092/projects");
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

                if(jsonData[key]["config"]){
                    table_body.innerHTML += "<tr style='--bs-table-bg: #D3d3d3' class='row-green' name='" + jsonData[key]["name"] + "' subject='" + jsonData[key]["subject"] + "' ><td><input type='checkbox' class='checkbox' disabled></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";
                }
                else{
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
                    console.log('ID project:', projectID);
                } else {
                    console.log('Error getting ID project');
                }
                const url_s = new URL("http://"+process.env.SERVER+":8092/students/project");
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
                    alert('Error sending form');
                });

                const url=new URL("http://"+process.env.SERVER+":8092/subject/token");
                url.searchParams.append('name',jsonData[key]["subject"]);

                fetch(url, {
                    method: 'GET',
                })
                    .then(response => {
                        if (!response.ok) {

                            throw new Error("Error sending form");
                        }
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
                                }
                                if (!response.ok) {
                                }
                                return await response.json();
                            })
                            .then(data => {

                                if (Array.isArray(data) && data.length === 0) {

                                    github_correct=false;
                                } else {

                                    console.log(students_git);
                                    //console.log(jsonData);
                                    let exists = existsUsername(students_git, data);
                                    if(!exists) github_correct=false;
                                    else github_correct=true;


                                }
                                const url_taig=new URL("https://api.taiga.io/api/v1/projects/by_slug");
                                url_taig.searchParams.append('slug',id_project);
                                //console.log(url_taig);

                                fetch(url_taig, {
                                    method: 'GET',
                                })
                                    .then(response => {
                                        if (response.ok) {

                                            taiga_correct=true;


                                        } else if (response.status === 401) {

                                            taiga_correct=false;

                                        }

                                        if(github_correct && taiga_correct){

                                            table_body.innerHTML += "<tr style='--bs-table-bg: #c6e6b8' class='row-green' name='" + jsonData[key]["name"] + "' subject='" + jsonData[key]["subject"] + "' ><td><input type='checkbox' class='checkbox' checked></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";

                                        }else{

                                            table_body.innerHTML += "<tr style='--bs-table-bg: #f98888' name='" + jsonData[key]["name"] + "' subject='" + jsonData[key]["subject"] + "' ><td><input type='checkbox' class='checkbox' ></td><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key]["subject"] + "</td></tr>";

                                        }

                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                        taiga_correct=false;

                                    });

                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });


                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error sending form');
                    });
                }}
        }

        //console.log(table_body)
        var rows = table.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; ++i) {
            rows[i].addEventListener("click", function () {
                const name = this.getAttribute("name");
                const subject = this.getAttribute("subject");
                openProjectWindow(name, subject);
            })
        }
        table.addEventListener("click",function (event){

            var target = event.target;
            //console.log(target.tagName)
            if(target.tagName==="TD"){
                var row = target.closest("tr");
                if (row) {
                    const name = row.getAttribute("name");
                    //console.log(name);
                    const subject = row.getAttribute("subject");
                    openProjectWindow(name, subject);
                }

            }
        })

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
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
    //console.log(selectedFile.name);

    const subject_value = document.getElementById("select_subject").value;

    const reader = new FileReader();

    reader.onload = function (event ) {
        console.log("File successfully loaded!");
        const arraybuff = event.target.result;
        const data = new Uint8Array(arraybuff);
        //console.log(data);

        const workbook = XLSX.read(data,{type: 'array'});
        //console.log(workbook);
        const sheetName = workbook.SheetNames[0];
        //console.log(sheetName);
        const worksheet = workbook.Sheets[sheetName];
        //console.log(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const info = jsonData.map(renameParameter);
        //console.log(info);
        const members = jsonData.map(extractMember1Params);
        console.log(members);

        const jsonProject = info.map(obj => {
            return {...obj, subject: subject_value};
        });
        const jsonStudent = members.map(obj => {
            return {...obj, subject: subject_value};
        });
        console.log(jsonProject);
        console.log(jsonStudent);

        fetch("http://"+process.env.SERVER+":8092/projects", {
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

            fetch("http://"+process.env.SERVER+":8092/students", {
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

                window.location.reload();

            }).catch(error => {
                console.error('Error:', error);
                alert('Error sending form');
            });
        }).catch(error => {
            console.error('Error:', error);
            alert('Error sending form');
        });

        const project = jsonData.map(infoProject);

    }
    reader.readAsArrayBuffer(selectedFile);

}//);

function existsUsername(usernames,json){

    for (let name in usernames){
        //console.log(usernames[name])
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

    getProjects();
    const table = document.getElementById("taula_body");
    //console.log(table)
    table.addEventListener("click",function (event){

        var target = event.target;
        if(target.tagName==="tr"){
           // console.log(target.dataset.name)
            const name = this.getAttribute("name");
            //console.log(name);
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
function openConfiguration(){
    window.name = JSON.stringify(configs);
    const windowProject = window.open("ConfigurationFiles.html","_blank");
    windowProject.onload = function() {
        windowProject.document.getElementById("subject").value = sub_config;
    };


}

function infoProject(obj){
    const info= {};
    for(const key in obj){
        if(key.startsWith('Identificador') || key.startsWith('URL del projecte Taiga')|| key.startsWith('URL de la vostra organització a GitHub') || key.startsWith('URL fitxer Sheets')){
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
    const url=new URL("http://"+process.env.SERVER+":8092/config");
    var projects_id = [];

    for(var i =1; i < rows.length; ++i){
        var row = rows[i];
        console.log(row);
        var element = row.getElementsByTagName("td");
        var projects = {};

        var selected = element[0].querySelector('input[type="checkbox"]');
        if(selected.checked){
            var project = {
                name: element[1].innerText,
                subject: element[2].innerText
            };
            projects_id.push(project);
            sub_config = element[2].innerText;

        }

    }
    var json = JSON.stringify(projects_id);

    configs = projects_id.map(project => project.name);


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Asegúrate de indicar que el cuerpo de la solicitud es JSON
        },
        body:json

    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }

        return response.json();
    }).then(data => {
        configs = data;
        openConfiguration();
        console.log(data);
        const name = data.name;


        data.forEach(function(element) {
            console.log(element.name)

        })

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
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
        console.log('Error getting ID project');
    }
}

function reupdate(){
    window.location.reload();
}

