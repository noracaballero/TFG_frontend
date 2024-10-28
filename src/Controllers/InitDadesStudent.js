
const subjecto = document.getElementById("subject");

const selectedOption = subjecto.value;
console.log(selectedOption);
let id_proj = -1;

console.log("InitDadesStudent.js loaded");

const inputGithub = document.getElementById('github_username');
const inputTaiga = document.getElementById('taiga_username');

inputGithub.addEventListener('blur', function() {

    getValidationG();
});
inputTaiga.addEventListener('blur', function() {

    getValidationT();
});
function getValidationTaiga(url_taig){

    const projectLink = url_taig
    let id_project;
    const parts = projectLink.split('/');

    const projectsIndex = parts.indexOf('project');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        const projectID = parts[projectsIndex + 1];
        id_project=projectID;
        console.log('ID del proyecto:', projectID);
    } else {
        console.log('No se pudo extraer el ID del proyecto');
    }

    const url=new URL("https://api.taiga.io/api/v1/projects/by_slug");
    url.searchParams.append('slug',id_project);
    console.log(url);

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
                correct_taiga=true;
                return true;

            } else if (response.status === 401) {
                label.classList.add('is-invalid');
                messagetaiga.style.display = 'block';
                correct_taiga=false;
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);

        });


}

function getValidationT(){

    const projectLink = document.getElementById("url_taiga").value;
    let id_project;
    const parts = projectLink.split('/');

    const projectsIndex = parts.indexOf('project');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        const projectID = parts[projectsIndex + 1];
        id_project=projectID;
        console.log('ID del proyecto:', projectID);
    } else {
        console.log('No se pudo extraer el ID del proyecto');
    }

    const url=new URL("https://api.taiga.io/api/v1/projects/by_slug");
    url.searchParams.append('slug',id_project);
    console.log(url);

    const label = document.getElementById('url_taiga');
    const messagetaiga = document.getElementById('invalid-feedback-div');

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.members);

                const isMember = data.members.some(member => member.username === document.getElementById("taiga_username").value);

                if(isMember){

                    inputTaiga.classList.remove('is-invalid')
                    inputTaiga.classList.add('is-valid');
                }
                else if(! isMember){

                    inputTaiga.classList.remove("is-valid")
                    inputTaiga.classList.add('is-invalid')
                }

        })
        .catch(error => {
            console.error('Error:', error);

        });


}

function getValidationG(){
    const githubUrl = document.getElementById("github_url").value;
    console.log(githubUrl);
    const orgsName= getNameGithub(githubUrl);
    console.log(orgsName);

    const urllo=new URL("http://"+process.env.SERVER+":8092/subject/token");
    const sub = document.getElementById("subject").value;
    urllo.searchParams.append('name',sub);
    console.log(urllo);
    fetch(urllo, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error sending form");
            }

            return response.text();
        })
        .then(token => {
            fetch(`https://api.github.com/orgs/${orgsName}/members`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error sending form");
                    }
                    return response.json();
                })
                .then(members => {
                    console.log(members)
                    console.log(document.getElementById("github_username").value)
                    const isMember = members.some(member => member.login === document.getElementById("github_username").value);
                    if(isMember){
                        inputGithub.classList.remove('is-invalid')
                        inputGithub.classList.add('is-valid');
                    }
                    else if(! isMember){
                        inputGithub.classList.remove("is-valid")
                        inputGithub.classList.add('is-invalid')
                    }
                    console.log(isMember);
                    return isMember;

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
function add(){
    var name = document.getElementById("name_Student").value;
    var github = document.getElementById("github_username").value;
    var taiga = document.getElementById("taiga_username").value;
    var sheets = document.getElementById("sheets_username").value;
    var output = document.getElementById("taula_body");
    output.innerHTML += "<tr><td>"+name+"</td><td>"+github+"</td><td>"+taiga+"</td><td>"+sheets+"</td></tr>"
}
document.getElementById("afegir_student").addEventListener('click',function (event){

    inputGithub.classList.remove('is-valid');
    inputTaiga.classList.remove('is-valid');

    const url = new URL("http://"+process.env.SERVER+":8092/projects/id");
    url.searchParams.append('name',document.getElementById("name").value);
    url.searchParams.append('subject', selectedOption);

    const name = document.getElementById('name').value;


    const subject = document.getElementById('subject').value;

    const name_stu = document.getElementById('name_Student').value;
    const githubUsername = document.getElementById('github_username').value;
    const taigaUsername = document.getElementById('taiga_username').value;
    const sheetsUsername = document.getElementById('sheets_username').value;

    const student = {
        name: name_stu,
        githubUsername: githubUsername,
        taigaUsername: taigaUsername,
        sheetsUsername: sheetsUsername
    };

    const requestData = [{
        name: name,
        subject: subject,
        members: [student]
    }];

    fetch("http://"+process.env.SERVER+":8092/students", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }

    }).then(data => {
        console.log(data);

    }).catch(error => {
        console.error('Error:', error);
        alert('Error sending form');
    });
    document.getElementById("name_Student").value = '';
    document.getElementById("github_username").value = '';
    document.getElementById("taiga_username").value = '';
    document.getElementById("sheets_username").value = '';

});

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

