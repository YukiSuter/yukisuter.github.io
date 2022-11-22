var services = [];

function checktable() {
    if (document.getElementById("departures")) {
        document.getElementById("departures").parentNode.removeChild(document.getElementById("departures"))
     }
}

function createTable() {
	// creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
    
    for (let i = 0; i < 23; i++) {
        // creates a table row
        const row = document.createElement("tr");
    
        for (let j = 0; j < services.length; j++) {
          // Create a <td> element and a text node, make the text
          // node the contents of the <td>, and put the <td> at
          // the end of the table row
          const cell = document.createElement("td");
          const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
    
        // add the row to the end of the table body
        tblBody.appendChild(row);
}

function getData() {
    var url = "https://cors-escapes.herokuapp.com/http://api.rtt.io/api/v1/json/search/EXG";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Basic " + btoa("rttapi_YukiSuter:e2f89a8a9f84d5d03c57612d8ce6449ce146d7c4"));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
           processData(xhr)
        }};

    xhr.send();
}

function processData(req) {
    console.log(req.responseText)
    responseParsed = JSON.parse(req.responseText)
    
    services = []
    for (let i=0; i<11; i++) {
        if (responseParsed["services"][i] != null) {
            services[i] = responseParsed["services"][i]
            console.log(services[i])
        }
    }

    createTable()

}