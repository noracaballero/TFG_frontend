
const subjectt = document.getElementById("subject");
const selectedOptionValue = subjectt.value;

console.log("InitDadesProject.js loaded");

function getBAck(){
    window.history.back();

}

document.getElementById("save-project").addEventListener('click',function (event){

    const name = document.getElementById("name").value;
    const URLgithub = document.getElementById("github_url").value;
    const url_taiga = document.getElementById("url_taiga").value;
    const url_sheets = document.getElementById("url_sheets").value;

    const taiga = getValidationTaiga(url_taiga);
    const github = getValidationGithub(URLgithub);
    console.log(github);

    var formData = new FormData();
    formData.append('name', name);
    formData.append('subject', selectedOptionValue);
    formData.append('URL_github', URLgithub);
    formData.append('URL_taiga', url_taiga);
    formData.append('URL_sheets', url_sheets);
    formData.append("ID_github",getNameGithub(URLgithub));
    formData.append("ID_taiga",getIDTaiga(url_taiga));

    for (const pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    fetch("http://localhost:8092/projects", {
        method: 'POST',
        body: formData
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

});

function getIDTaiga(url_taiga){
    const projectLink = url_taiga
    let id_project;
    const parts = projectLink.split('/');

    const projectsIndex = parts.indexOf('project');

    if (projectsIndex !== -1 && projectsIndex + 1 < parts.length) {
        const projectID = parts[projectsIndex + 1];
        return projectID
        console.log('ID del proyecto:', projectID);
    } else {
        console.log('No se pudo extraer el ID del proyecto');
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
                return true;

            } else if (response.status === 401) {
                label.classList.add('is-invalid');
                messagetaiga.style.display = 'block';
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
        console.log('No se pudo extraer el ID del proyecto');
    }
}
//Validació github
function getValidationGithub(url_git){

    const orgsName = getNameGithub(url_git);

    console.log("weweweweew"+url_git);

    const label = document.getElementById('github_url');
    const messagetaiga = document.getElementById('invalid-feedback-div-git');

    const url=new URL("http://localhost:8092/subject");
    url.searchParams.append('name',selectedOptionValue);
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
            fetch(`https://api.github.com/orgs/${orgsName}/members`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de la membresía');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length === 0) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        console.log('La respuesta está vacía');
                    } else {
                        label.classList.remove('is-invalid');
                        label.classList.add('is-valid');
                        messagetaiga.style.display = 'none';
                        console.log('La respuesta no está vacía');
                    }
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




