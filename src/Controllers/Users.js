function patata(){
    const configData = window.opener.name;

    if (configData) {
        const configs = JSON.parse(configData);
        console.log(configs); // Usar los datos como necesites

        // Asignar los datos a un elemento oculto si es necesario
        document.getElementById("patata").value = configData;
    }

}

function getUsers(){
    const url=new URL("http://localhost:8092/users");


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
        console.log("AAAAAAAAAAAA "+name);

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