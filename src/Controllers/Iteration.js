const subject = window.opener.name;
function getIterations(){


    fetch("http://"+process.env.SERVER+":8092/iteration?subject="+subject,{
        method: 'GET',
    }).then(response => {
        if(!response.ok) {
            throw new Error("Error sending form");
        }
        return response.json();
    }).then(data =>{
        console.log(data);
        const name = data.name;


        const tableBody = document.getElementById('it_table_body');
        tableBody.innerHTML = '';

        data.forEach(function(element) {

            const tr = document.createElement('tr');
            tr.innerHTML = `
                    <td>${element.name}</td>
                    <td>${element.fromData}</td>
                    <td>${element.toData}</td>
                `;
            tableBody.appendChild(tr);
        })
    })
}

function getBAck(){
    window.history.back();
}

function formatDate(dateString) {
    const dateParts = dateString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}


function afegirIteration(){

    var name = document.getElementById("iteration-name").value;
    var start = document.getElementById("start-date").value;

    var end = document.getElementById("end-date").value;

    const url = new URL("http://"+process.env.SERVER+":8092/iteration");

    var data = {
        name: name,
        subject:subject,
        fromData: formatDate(start),
        toData: formatDate(end),

    };
    console.log(JSON.stringify(data));

    fetch(url, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error sending form");
        }

    });
    window.location.reload();
}

function openIteration(subject){
    window.name = subject;
    window.open("Iteration.html","_blank");
}