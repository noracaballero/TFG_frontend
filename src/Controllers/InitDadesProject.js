
const subjectt = document.getElementById("subject");
const selectedOptionValue = subjectt.value;


function getBAck(){
    window.history.back();
}
let correct_github = false;
let correct_taiga =false;


document.getElementById("save-project").addEventListener('click',function (event){

    const name = document.getElementById("name").value;
    const sub = document.getElementById("subject").value;
    const URLgithub = document.getElementById("github_url").value;
    const url_taiga = document.getElementById("url_taiga").value;
    const url_sheets = document.getElementById("url_sheets").value;


    var formData = new FormData();
    formData.append('name', name);
    formData.append('subject', sub);
    formData.append('URL_github', URLgithub);
    formData.append('URL_taiga', url_taiga);
    formData.append('URL_sheets', url_sheets);
    var data = [{
        name: name,
        subject: sub,
        urlGithub: URLgithub,
        urlTaiga: url_taiga,
        urlSheets: url_sheets
    }];

        fetch("http://"+process.env.SERVER+":8092/projects", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error("Error sending form");
            }

        }).catch(error => {
            console.error('Error:', error);
            alert('Error sending form');
        });

});
var Github_input = document.getElementById("github_url");

Github_input.addEventListener('blur', function() {
    getValidationGithub(document.getElementById("github_url").value);
});

var Taiga_input = document.getElementById("url_taiga");

Taiga_input.addEventListener('blur', function() {

    getValidationTaiga(document.getElementById("url_taiga").value);
});

function getIDTaiga(url_taiga){
    const projectLink = url_taiga
    let id_project;
    const parts = projectLink.split('/');

    const projectsIndex = parts.indexOf('project');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        const projectID = parts[projectsIndex + 1];
        return projectID
        console.log('ID project:', projectID);
    } else {
        console.log('Error getting ID project');
    }
}

//Validació que el taiga es públic
function getValidationTaiga(url_taig){

    const projectLink = url_taig
    let id_project;
    const parts = projectLink.split('/');

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
//Validació github
function getValidationGithub(url_git){

    const orgsName = getNameGithub(url_git);

    const label = document.getElementById('github_url');
    const messagetaiga = document.getElementById('invalid-feedback-div-git');

    const url=new URL("http://"+process.env.SERVER+":8092/subject/token");
    const sub = document.getElementById("subject").value;

    url.searchParams.append('name',sub);

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
                        throw new Error('Error getting members');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length === 0) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        correct_github=false;

                    } else {
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
function getSubjects() {
    const selected_subject = document.getElementById("subject")


    fetch("http://"+process.env.SERVER+":8092/subject", {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    }).then(data => {
        console.log(data);
        const name = data.name;

        data.forEach(function (element) {
            console.log(element.name)
            const option = document.createElement("option")
            option.text = element.name;
            selected_subject.add(option);
        })
    })
}





