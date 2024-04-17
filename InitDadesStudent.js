
const subjecto = document.getElementById("subject");

const selectedOption = subjecto.value;
console.log(selectedOption);

console.log("InitDadesStudent.js loaded");

const inputGithub = document.getElementById('github_username');
const inputTaiga = document.getElementById('taiga_username');

inputGithub.addEventListener('blur', function() {
    // Llamar a la función que deseas ejecutar cuando el usuario ha terminado de escribir y ha salido del input
    getValidationG();
});
inputTaiga.addEventListener('blur', function() {
    // Llamar a la función que deseas ejecutar cuando el usuario ha terminado de escribir y ha salido del input
    getValidationT();
});

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
        .then(response => {

        })
        .then(data => {
            console.log("sfdsfsf",data)
            // Acceder al parámetro 'members' del objeto 'data'
            if (data.hasOwnProperty('members')) {
                // Obtener el array de miembros
                const members = data.members;

                // Array para almacenar los nombres de usuario
                const usernames = [];

                // Recorrer el array de miembros y extraer los nombres de usuario
                members.forEach(member => {
                    // Verificar si la clave 'username' existe en el objeto 'member'
                    if (member.hasOwnProperty('username')) {
                        // Agregar el nombre de usuario al array 'usernames'
                        usernames.push(member.username);
                    }
                });

                // Hacer algo con los nombres de usuario, como imprimirlos en la consola
                console.log('Nombres de usuario:', usernames);
            } else {
                console.log('No se encontraron miembros en el objeto JSON.');
            }
            // Hacer algo con los datos obtenidos
            console.log('Miembros:', members);
        })
        .then(members => {
            console.log(members)
            // Verificar si el usuario está en la lista de miembros de la organización
            /*console.log(document.getElementById("github_username").value)
            const isMember = members.some(member => member.login === document.getElementById("github_username").value);
            console.log(isMember);
            return isMember;*/

        })
        .catch(error => {
            console.error('Error:', error);

        });


}

function getValidationG(){
    const githubUrl = document.getElementById("github_url").value; // Obtener el valor de la URL de GitHub
    console.log(githubUrl);
    const orgsName= getNameGithub(githubUrl); // Pasar el valor de la URL de GitHub a la función getNameGithub
    console.log(orgsName);

    const urllo=new URL("http://localhost:8092/subject");
    urllo.searchParams.append('name',selectedOptionValue);
    console.log(urllo);
    fetch(urllo, {
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
                .then(members => {
                    console.log(members)
                    // Verificar si el usuario está en la lista de miembros de la organización
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
            alert('Hubo un error al enviar el formulario');
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

    input.classList.remove('is-valid');
    // Definir los valores de los parámetros name e id_project

// Construir la URL con los parámetros
    const url = new URL("http://localhost:8092/projects");
    url.searchParams.append('name',document.getElementById("name").value);
    url.searchParams.append('subject', selectedOption);
    console.log(url)

    fetch(url, {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        console.log(response)
        return response.text();
    }).then(data => {
        console.log(data);
        const id_proj = parseInt(data);
        console.log(id_proj);
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });

    var formData = new FormData();
    formData.append('name', document.getElementById("name_Student").value);
    formData.append('username_github', document.getElementById("github_username").value);
    formData.append('username_taiga', document.getElementById("taiga_username").value);
    formData.append('username_sheets', document.getElementById("sheets_username").value);

    /*const githubUrl = document.getElementById("github_url").value; // Obtener el valor de la URL de GitHub
    const orgsName= getNameGithub(githubUrl); // Pasar el valor de la URL de GitHub a la función getNameGithub
    console.log(orgsName);

    const urllo=new URL("http://localhost:8092/subject");
    urllo.searchParams.append('name',selectedOptionValue);
    console.log(urllo);
    fetch(urllo, {
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
                .then(members => {
                    console.log(members)
                    // Verificar si el usuario está en la lista de miembros de la organización
                    console.log(document.getElementById("github_username").value)
                    const isMember = members.some(member => member.login === document.getElementById("github_username").value);
                    console.log(isMember);

                    return isMember;

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario');
        });
*/
    fetch("http://localhost:8092/student", {
        method: 'POST',
        // No necesitas especificar 'mode: no-cors' al usar FormData
        // No necesitas especificar Content-Type al usar FormData
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }

    }).then(data => {
        console.log(data);
        alert('Formulario enviado exitosamente');
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
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
        console.log('No se pudo extraer el ID del proyecto');
    }
}

