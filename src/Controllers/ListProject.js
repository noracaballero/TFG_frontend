
var api = window.apiUrl;
function getProjects(){



    const url = new URL("http://localhost:8092/projects");
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
        //console.log(data);
        const table = document.getElementById("table_proj")
        const jsonData = JSON.parse(data);
        //const proyectosJson =  data.json();

        console.log(jsonData);
        for(const key in jsonData){
            //console.log(key)
            if(jsonData.hasOwnProperty(key)){
                table.innerHTML += "<tr><td><input type='checkbox' checked></td><td>"+jsonData[key]["name"]+"</td><td>"+jsonData[key]["subject"]+"</td></tr>";
            }
        }

    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario');
    });
}

function configurateProject(){

    var table = document.getElementById("table_proj");
    var rows = table.getElementsByTagName("tr");
    const url=new URL("http://localhost:8092/config");


    var list

    for(var i =1; i < rows.length; ++i){
        var row = rows[i];
        console.log(row);
        var element = row.getElementsByTagName("td");
        var projects = {};

        var selected = element[0].querySelector('input[type="checkbox"]');
        if(selected.checked){
            var coma =",";
            console.log(coma)
            //coma = decodeURIComponent(coma);
            var data = element[1].innerText+","+element[2].innerText;

            url.searchParams.append('project'+i,data);
            console.log(element[1].innerText);
            console.log(element[2].innerText);
        }
        console.log(element[0].innerText);
    }
    console.log(url);

    fetch(url, {
        method: 'GET',

    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }
        console.log(response)
        return response.json();
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar los proyectos');
    });
}