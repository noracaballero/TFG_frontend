function patata(){
    const configData = window.opener.name;

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs); // Usar los datos como necesites

        // Asignar los datos a un elemento oculto si es necesario
        document.getElementById("patata").value = configData;
    }

}

function metrics(){
    patata();
    var projects = document.getElementById("patata").value;
    projects = JSON.parse(projects)
    console.log("AQUEST");
    console.log(projects);
    fetch("http://localhost:8092/metrics",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: projects
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        console.log("done");
        update(25);
        return response.json();
    })

    fetch("http://localhost:8092/factors",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: projects
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        update(50);
        return response.json();
    })
    fetch("http://localhost:8092/strategic",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: projects
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        update(75);
        return response.json();
    })
    fetch("http://localhost:8092/users",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: projects
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        update(100);
        return response.text();

    }).then(data =>{
        console.log(data);
    })
}

function update(value){
    const bar = document.getElementById("bar");
    bar.style.width = value + '%';
    bar.setAttribute('aria-valuenow',value);
}