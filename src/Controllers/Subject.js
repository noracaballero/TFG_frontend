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
        const name = data.name;
        console.log("AAAAAAAAAAAA "+name);

        const tableBody = document.getElementById('subject_table_body');
        tableBody.innerHTML = '';

        data.forEach(function(element) {
            const gittok = element.token_github;
            const tok = '*'.repeat(gittok.length);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${element.name}</td>
                    <td>${element.github ? 'Sí' : 'No'}</td>
                    <td>${tok}</td>
                    <td>${element.taiga ? 'Sí' : 'No'}</td>
                    <td>${element.sheets ? 'Sí' : 'No'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editSubject( '${element.name}', ${element.github}, '${element.token_github}', ${element.taiga}, ${element.sheets})">Delete</button>
                    </td>
                `;
            tableBody.appendChild(tr);
        })
    })
}

function editSubject(name, github, token_github, taiga, sheets) {
    document.getElementById('name').value = name;
    document.getElementById('github').checked = github;
    document.getElementById('token_github').value = token_github;
    document.getElementById('taiga').checked = taiga;
    document.getElementById('sheets').checked = sheets;
}

function afegirSubject(){
    var name = document.getElementById("name").value;
    var github = document.getElementById("github").checked;
    console.log(github);
    var taiga = document.getElementById("taiga").checked;
    var sheets = document.getElementById("sheets").checked;
    var token_github = document.getElementById("token_github").value;


    const url = new URL("http://localhost:8092/subject");
    console.log("holaaaa"+url);
    var data = {
        name: name,
        github:github,
        token_github: token_github,
        taiga: taiga,
        sheets: sheets
    };
    console.log(JSON.stringify(data));

    fetch("http://localhost:8092/subject", {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }

    }).then(data => {
        console.log(data);
        alert('Formulario enviado exitosamente');
        getSubjects();
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
    document.getElementById("name").value = '';
    document.getElementById("github").checked = false;
    document.getElementById("token_github").value = '';
    document.getElementById("taiga").checked = false;
    document.getElementById("sheets").checked = false;
}