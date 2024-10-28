
let members_github = [];
let members_taiga = [];
function update(name,subject){
    window.location.reload();
    document.getElementById("name").value=name;
    document.getElementById("subject").value=subject;
}

function updateProject(){
    const name = document.getElementById("name").value;
    const sub = document.getElementById("subject").value;
    document.getElementById("github_url").value
    const updatedData = {
        name:document.getElementById("name").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        urlGithub: document.getElementById("github_url").value.trim(),
        urlTaiga: document.getElementById("url_taiga").value.trim(),
        urlSheets: document.getElementById("url_sheets").value.trim()
    };

    fetch("http://"+process.env.SERVER+":8092/projects/"+name, {
        method: 'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(updatedData)
    }).then(response => {
        console.log(response)
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        //update(name,sub);
        window.close();

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
    });

}

function getInfoProject(){
    const url = new URL("http://"+process.env.SERVER+":8092/projects/id");


    url.searchParams.append('name',document.getElementById("name").value);
    url.searchParams.append('subject',document.getElementById("subject").value)

    fetch(url,  {
    method:'GET',
    }).then(response =>{
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        return response.text()
    }).then(async data => {
        const jsonData = JSON.parse(data);
        console.log(jsonData);
        document.getElementById("github_url").value = jsonData["urlGithub"];
        document.getElementById("url_taiga").value = jsonData["urlTaiga"];
        document.getElementById("url_sheets").value = jsonData["urlSheets"];
        console.log(jsonData["urlGithub"])

        getValidationGithub(jsonData["urlGithub"]);
        getValidationTaiga(jsonData["urlTaiga"]);




    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
    });


}

function getStudents(){
    const url = new URL("http://"+process.env.SERVER+":8092/students/project");
    var name = document.getElementById("name").value;
    var subject = document.getElementById("subject").value;
    url.searchParams.append('name',name);
    url.searchParams.append('subject',subject);

    fetch(url,  {
        method:'GET',
    }).then(response =>{
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        return response.text()
    }).then(data => {
        const jsonData = JSON.parse(data);
        console.log(jsonData);

        const table_body = document.getElementById("taula_body");



        console.log(jsonData);
        const promises = [];
        for (const key in jsonData) {
            //console.log(key)
            if (jsonData.hasOwnProperty(key)) {
                console.log(jsonData[key]);
            }

            }

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending the form');
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

function getValidationGithub(url_git){

    const orgsName = getNameGithub(url_git);

    console.log("weweweweew"+url_git);

    const label = document.getElementById('github_url');
    const messagetaiga = document.getElementById('invalid-feedback-div-git');

    const url=new URL("http://"+process.env.SERVER+":8092/subject/token");
    url.searchParams.append('name',document.getElementById("subject").value);
    console.log(url);
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
            console.log(token);
            fetch(`https://api.github.com/orgs/${orgsName}/members`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`
                }
            })
                .then(response => {
                    if (response.status === 404) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        correct_github=false;
                    }
                    if (!response.ok) {
                        throw new Error('Error sending the form');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length === 0) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        correct_github=false;

                    } else {
                        for(let key in data){
                            console.log(data[key]["login"]);
                            members_github.push(data[key]["login"]);
                        }
                        console.log(members_github);
                        label.classList.remove('is-invalid');
                        label.classList.add('is-valid');
                        messagetaiga.style.display = 'none';
                        correct_github=true;

                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending form');
        });
}
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-warning')) {
        event.preventDefault();
        saveRowChanges(event.target.closest('tr'));
    }
});


function saveRowChanges(row) {
    const cells = row.querySelectorAll('td');
    const updatedData = {
        id:cells[0].textContent,
        name: cells[1].textContent.trim(),
        username_github: cells[2].textContent.trim(),
        username_taiga: cells[3].textContent.trim(),
        username_sheets: cells[4].textContent.trim()
    };
    if(members_github.includes(cells[2].textContent.trim())){
        cells[2].style.backgroundColor = '#c6e6b8';
    }

    if(members_taiga.includes(cells[3].textContent.trim())){
        cells[3].style.backgroundColor = '#c6e6b8';
    }

    console.log(updatedData);
    fetch("http://"+process.env.SERVER+":8092/students/"+cells[0].textContent, {
        method: 'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(updatedData)
    }).then(response => {
        console.log(response)
        if (!response.ok) {
            throw new Error("Error sending form");
        }


    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
    });


}
function getValidationTaiga(url_taig){

    const projectLink = url_taig
    let id_project;
    const parts = projectLink.split('/');
    let members =[];

    const projectsIndex = parts.indexOf('project');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        const projectID = parts[projectsIndex + 1];
        id_project=projectID;
        console.log('ID project:', projectID);
    } else {
        console.log('Error getting ID project');
    }

    const url=new URL("https://api.taiga.io/api/v1/projects/by_slug");
    url.searchParams.append('slug',id_project);


    const label = document.getElementById('url_taiga');
    const messagetaiga = document.getElementById('invalid-feedback-div');

    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            if (response.ok) {
                label.classList.remove('is-invalid');
                label.classList.add('is-valid');
                messagetaiga.style.display = 'none';
                correct_taiga = true;
                return response.json();

            } else if (response.status === 401) {
                label.classList.add('is-invalid');
                messagetaiga.style.display = 'block';
                correct_taiga = false;
                return false;
            }
        })
        .then(data =>{


            if (Array.isArray(data) && data.length === 0) {
                label.classList.add('is-invalid');
                messagetaiga.style.display = 'block';
                correct_taiga=false;
                console.log('La respuesta está vacía');
            } else {
                data.members.forEach(member => {
                members.push(member.username);
                members_taiga.push(member.username);
                });

                console.log(members);
                label.classList.remove('is-invalid');
                label.classList.add('is-valid');
                messagetaiga.style.display = 'none';
                correct_taiga=true;
            }
            updateTable();

        })
        .catch(error => {
            console.error('Error:', error);

        });

}

function updateTable(){
    const url_s = new URL("http://"+process.env.SERVER+":8092/students/project");
    var name = document.getElementById("name").value;
    var subject = document.getElementById("subject").value;
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

        let table_body = document.getElementById("table_body");

        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const tr = document.createElement('tr');

                const username_g = jsonData[key]["username_github"].trim()
                console.log(username_g);
                console.log(members_github);
                let github = false;
                for(let i = 0; i< members_github.length; ++i){
                    if(members_github[i].trim() === username_g) {
                        github=true;
                    }
                }
                const username_t = jsonData[key]["username_taiga"].trim()
                console.log(username_t);
                console.log(members_taiga);
                let taiga = false
                for(let  i= 0; i< members_taiga.length; ++i){
                    if(members_taiga[i].trim() === username_t) { taiga=true;}
                }

                tr.innerHTML = `
                                        <td>${jsonData[key]["id"]}</td>
                                        <td contenteditable="true"> ${jsonData[key]["name"]}</td>
                                        <td style="background-color: ${github ? '#c6e6b8' : '#f98888'}" contenteditable="true"> ${jsonData[key]["username_github"]}</td>
                                        <td style="background-color: ${taiga ? '#c6e6b8' : '#f98888'}" contenteditable="true"> ${jsonData[key]["username_taiga"]} </td>
                                        <td contenteditable="true"> ${jsonData[key]["username_sheets"]} </td>
                                        <td>
                                            <button class="btn btn-warning btn-sm" >Save</button>
                                        </td>
                                    `;

                table_body.append(tr);
            }
        }

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
    });
}

window.addEventListener('beforeunload', function () {
    if (window.opener && !window.opener.closed) {
        window.opener.reupdate();
    }
});