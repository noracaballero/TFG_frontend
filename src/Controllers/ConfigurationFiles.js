let configs = [];
function openConfiguration(){
    //imports();
    configs = document.getElementById("projects").value;
    window.name = JSON.stringify(configs);
    console.log(configs);
    const windowProject = window.open("FinalConfiguration.html","_blank");
    windowProject.document.getElementById("subject").value = document.getElementById("subject").value;

}

function setUp(){
    const configData = window.opener.name;
    //imports();

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs);

        document.getElementById("projects").value = configData;
    }

}
function getBAck(){
    window.history.back();
}



