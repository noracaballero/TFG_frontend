let rootwindow = window.opener;
window.onbeforeunload = function() {
    if (rootwindow && !rootwindow.closed) {
        rootwindow.close();
    }
};
function setUp(){
    const configData = window.opener.name;

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs);

        document.getElementById("info").value = configData;
    }

}

function getUsers(){
    var projects = document.getElementById("info").value;
    console.log(projects);
    projects = JSON.parse(projects)
    console.log(projects);

    if (typeof projects === 'string' && projects.startsWith('[') && projects.endsWith(']')) {

        projects = projects.substring(1, projects.length - 1);

        projects = projects.split(',').map(p => p.trim());
    }
    let query = projects.map(p => `projects=${encodeURIComponent(p)}`).join('&');

    let url = `http://'+process.env.SERVER+':8092/users?${query}`;
    url = url.replace(/%22/g, '');
    console.log(url.toString());


    fetch(url,{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    }).then(data =>{
        console.log(data);
        const name = data.name;

        const tableBody = document.getElementById('table_body');
        tableBody.innerHTML = '';

        data.forEach(function(element) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${element.username}</td>
                    <td>${element.password}</td>
                `;
            tableBody.appendChild(tr);
        })
    })
}

function finish(){
    var projects = document.getElementById("info").value;
    console.log(projects);
    projects = JSON.parse(projects)
    fetch("http://"+process.env.SERVER+":8092/config/finsih",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: projects
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.text();

    }).then(data =>{
        console.log(data);
    })
}

function closeWindow(){
    window.close();
}