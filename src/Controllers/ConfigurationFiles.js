let configs = [];
function openConfiguration(){
    imports();
    configs = document.getElementById("patata").value;
    window.name = JSON.stringify(configs);
    console.log(configs);
    const windowProject = window.open("FinalConfiguration.html","_blank");
    /*windowProject.onload = function() {
        windowProject.document.getElementById("patata").value =configs ;
    };*/
}

function setUp(){
    const configData = window.opener.name;
    //imports();

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs); // Usar los datos como necesites

        // Asignar los datos a un elemento oculto si es necesario
        document.getElementById("patata").value = configData;
    }

}

function imports(){
    fetch("http://localhost:8092/config/imports",{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    })
}

