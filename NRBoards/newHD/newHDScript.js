var services = [];

function checktable() {
    if (document.getElementById("departures")) {
        document.getElementById("departures").parentNode.removeChild(document.getElementById("departures"))
     }
}

function createTable() {
	const body = document.body,
        tbl = document.createElement('table');
    tbl.style.width = '100px';
    tbl.style.border = '1px solid black';
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