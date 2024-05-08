
function update(name,subject){
    document.getElementById("name").value=name;
    document.getElementById("subject").value=subject;
}

function getInfoProject(){
    const url = new URL("http://localhost:8092/projects/id");
    console.log("patatattatata");
    //console.log(document.getElementById("name").value);

    url.searchParams.append('name',document.getElementById("name").value);
    url.searchParams.append('subject',document.getElementById("subject").value)

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
        document.getElementById("github_url").value=jsonData["urlGithub"];
        getValidationGithub(jsonData["urlGithub"]);
        document.getElementById("url_taiga").value=jsonData["urlTaiga"];
        getValidationTaiga(jsonData["urlTaiga"]);
        document.getElementById("url_sheets").value=jsonData["urlSheets"];
        console.log(jsonData["urlGithub"])
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
    console.log("eyyytuukyiy");

}

function getStudents(){
    console.log("eyyytuukyiy");
    const url = new URL("http://localhost:8092/students/project");
    var name = document.getElementById("name").value;
    console.log(name);
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
                //table_body.innerHTML += "<tr><td>" + jsonData[key]["name"] + "</td><td>" + jsonData[key][""] + "</td></tr>";

            }

    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
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
    let members =[];

    const url=new URL("http://localhost:8092/subject/token");
    url.searchParams.append('name',document.getElementById("subject").value);
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
                .then(response => {
                    if (response.status === 404) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        correct_github=false;
                        //throw new Error('Error 404: Recurso no encontrado');
                    }
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de la membresía');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length === 0) {
                        label.classList.add('is-invalid');
                        messagetaiga.style.display = 'block';
                        correct_github=false;
                        console.log('La respuesta está vacía');
                    } else {
                        for(let key in data){
                            console.log(data[key]["login"]);
                            members.push(data[key]["login"]);
                        }
                        console.log(members);
                        label.classList.remove('is-invalid');
                        label.classList.add('is-valid');
                        messagetaiga.style.display = 'none';
                        correct_github=true;
                        console.log('La respuesta no está vacía');
                    }
                    const url_s = new URL("http://localhost:8092/students/project");
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
                        console.log(jsonData);

                        const table_body = document.getElementById("table_body");

                        console.log(jsonData);
                        const promises = [];

                            for (const key in jsonData) {
                                if (jsonData.hasOwnProperty(key)) {
                                if (members.includes(jsonData[key]["username_github"])) {
                                    console.log("correctooo");
                                    table_body.innerHTML += "<tr><td contenteditable=\"true\">" + jsonData[key]["name"] + "</td><td style='--bs-table-bg: #c6e6b8' contenteditable=\"true\">" + jsonData[key]["username_github"] + "</td><td contenteditable=\"true\">" + jsonData[key]["username_taiga"] + "</td><td contenteditable=\"true\">" + jsonData[key]["username_sheets"] + "</td></tr>";
                                }
                                else{
                                    table_body.innerHTML += "<tr><td contenteditable=\"true\">" + jsonData[key]["name"] + "</td><td style='--bs-table-bg: #f98888' contenteditable=\"true\">" + jsonData[key]["username_github"] + "</td><td contenteditable=\"true\">" + jsonData[key]["username_taiga"] + "</td><td contenteditable=\"true\">" + jsonData[key]["username_sheets"] + "</td></tr>";
                                }
                                //console.log(key)



                            }
                        }

                    }).catch(error => {
                        console.error('Error:', error);
                        alert('Hubo un error al enviar el formulario');
                    });
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