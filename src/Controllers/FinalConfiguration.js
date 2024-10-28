
function patata(){
    const configData = window.opener.name;

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs);

        document.getElementById("patata").value = configData;
    }
}
function openUsers(){
    configs = document.getElementById("patata").value;
    window.name = JSON.stringify(configs);
    console.log(configs);
    const windowProject = window.open("Users.html","_blank");

}
function getBAck(){
    window.history.back();
}

function metrics(){
    patata();
    var projects = document.getElementById("patata").value;
    projects = JSON.parse(projects)
    console.log("AQUEST");
    console.log(projects);

    fetch("http://"+process.env.SERVER+":8092/config/imports",{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        fetch("http://"+process.env.SERVER+":8092/metrics",{
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
            update(20);
            //return response.json();
            fetch("http://"+process.env.SERVER+":8092/factors",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: projects
            }).then(response => {
                if(!response.ok) {
                    throw new Error("Error sending form");
                }
                update(40);
                //return response.json();
                fetch("http://"+process.env.SERVER+":8092/strategic",{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: projects
                }).then(response => {
                    if(!response.ok) {
                        throw new Error("Error sending form");
                    }
                    update(60);
                    //return response.json();
                    fetch("http://"+process.env.SERVER+":8092/students/LD",{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: projects
                    }).then(response => {
                        if(!response.ok) {
                            throw new Error("Error sending form");
                        }
                        update(80);
                            fetch("http://"+process.env.SERVER+":8092/users",{
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

                    })
                })
            })
        })
    })
}
function imports(){

    fetch("http://"+process.env.SERVER+":8092/config/imports",{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    })
}

function update(value){
    const bar = document.getElementById("bar");
    bar.style.width = value + '%';
    bar.setAttribute('aria-valuenow',value);
}