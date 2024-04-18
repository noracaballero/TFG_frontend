
function getProjects(){

    const url = new URL("http://localhost:8092/projects/list");
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
        const table = document.getElementById("tablee")
        const jsonData = JSON.parse(data)
        console.log(jsonData);
        for(const key in jsonData){
            console.log(key)
            if(jsonData.hasOwnProperty(key)){

                const value = jsonData[key];
                console.log(value);
                table.innerHTML += "<tr><td>"+key+"</td><td>"+value+"</td></tr>"
                //table.appendChild(linea);
            }
        }

    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
}