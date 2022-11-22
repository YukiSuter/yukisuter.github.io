var services = [];
var table = [];
var stationsResponseParsed;
var stationsProcessed = false;


const d = new Date();

var imgSources = {ready:"images/platformSet.png", wait:"images/platformWait.png", toc:"images/TOCLogos/"}

var myImages = [], img;

var rowLabels = ["time", "destination", "via", "platformLabel", "platform", "callingAtLabel", "ca0", "ca1", "ca2", "ca3", "ca4", "ca5", "ca6", "ca7", "ca8", "ca9", "ca10", "ca11", "ca12", "ca13", "message", "coaches", "logo"]


// SEARCH BOX
function autocomplete() {
    var url, stationOption;
    url = './../stationnames.json';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr)
            addOptions(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function addOptions(arr) {
    var list = document.getElementById("stationList")

    for (var key in rr) {
        if (rr.hasOwnProperty(key)) {
            var option = document.createElement('option');
            option.innerHTML = key
            optopm.value = value
            list.appendChild(option);
        }
    }
        
}
//////////////////////////////////////////////////////////




function getData() {
    var url = "https://cors-escapes.herokuapp.com/http://api.rtt.io/api/v1/json/search/" + document.getElementById("CRS").value;

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

function getTrainData(num) {
    var urlTrain = "https://cors-escapes.herokuapp.com/http://api.rtt.io/api/v1/json/service/" + services[num]["serviceUid"] + "/" + d.getFullYear().toString() + "/" + (d.getMonth()+1).toString() + "/" + d.getDate().toString() ;
    console.log(urlTrain)
    var xhrTrain = new XMLHttpRequest();
    xhrTrain.open("GET", urlTrain);

    xhrTrain.setRequestHeader("Accept", "application/json");
    xhrTrain.setRequestHeader("Authorization", "Basic " + btoa("rttapi_YukiSuter:e2f89a8a9f84d5d03c57612d8ce6449ce146d7c4"));

    var processed;

    xhrTrain.onreadystatechange = function () {
        if (xhrTrain.readyState === 4) {
           processTrainData(num,xhrTrain)
        }};

    xhrTrain.send();
}

function processData(req) {
    responseParsed = JSON.parse(req.responseText)
    
    services = []
    for (let i=0; i<11; i++) {
        if (responseParsed["services"][i] != null) {
            services[i] = responseParsed["services"][i]
        }
    }
    createTable()

}

function processTrainData(onTrain, reqTrain) {
    stationsResponseParsed = JSON.parse(reqTrain.responseText)
    console.log("Processed Train Data")
    var iteratedPast = 0;
    console.log(stationsResponseParsed)
    for (let j=0; j < stationsResponseParsed["locations"].length; j++) {
        console.log(j)
        if (j != 0) {
            console.log(stationsResponseParsed["locations"][j-1]["crs"] + "///" + document.getElementById("CRS").value)
            if (stationsResponseParsed["locations"][j-1]["crs"] == document.getElementById("CRS").value) {
                iteratedPast = j
            }
        }
        if (iteratedPast != 0) {
            console.log("Captured Station")
            console.log("train" + onTrain.toString() + "ca" + (j-iteratedPast+1).toString())
            document.getElementById("train" + onTrain.toString() + "ca" + (j-iteratedPast+1).toString()).innerHTML = stationsResponseParsed["locations"][j]["description"]
        }
    }

}

function checkTable() {
    var boardContainer = document.getElementById("boardContainer");
    if (boardContainer.lastElementChild) {
        var child = boardContainer.lastElementChild;
        while (child) {
            boardContainer.removeChild(child);
            child = boardContainer.lastElementChild;
        }
     }
}

function setColImage(obj, imgURL, id) {
    img = document.createElement("img");
    img.src = imgURL;
    img.id = id
    return obj.appendChild(img)
}

function createTable() {
    console.log(services)
	// creates a <table> element and a <tbody> element

    board = document.createElement("div")
    board.id = "board"
    board.className += "row"
    
    for (let i = 0; i < services.length; i++) {

        col = document.createElement("div")
        col.className += "column"
        col.id = "train" + i.toString()
        
        image = setColImage(col,imgSources.ready, "train" + i.toString() + "image");
        image.className = "backImage"

        setColImage(col, "", "train" + i.toString() + "toc").className = "tocImage"
        

        for (let j = 0; j < rowLabels.length; j++) {
            var text = document.createElement("h4")
            text.id = "train" + i.toString() + rowLabels[j]
            text.className += rowLabels[j]

            col.appendChild(text)
        }
        board.appendChild(col)
    }
    checkTable()
    document.getElementById("boardContainer").appendChild(board)
    
    console.log("Table Complete: ")
    console.log(table)
    fillTable()
}



function fillTable() {
    for (i = 0; i < services.length; i++) {
        
        console.log("train" + i.toString() + "time")
        document.getElementById("train" + i.toString() + "time").innerHTML = services[i]["locationDetail"]["realtimeDeparture"] //Time
        document.getElementById("train" + i.toString() + "destination").innerHTML = services[i]["locationDetail"]["destination"][0]["description"] //Destination

        document.getElementById("train" + i.toString() + "toc").src = imgSources["toc"] + "/" + services[i]["atocCode"] + ".png"

        if (services[i]["locationDetail"]["platformConfirmed"]) { //Platform Labels
            document.getElementById("train" + i.toString() + "platformLabel").innerHTML = "Platform"
            document.getElementById("train" + i.toString() + "platform").innerHTML = services[i]["locationDetail"]["platform"]
        } else {
            document.getElementById("train" + i.toString() + "platformLabel").innerHTML = ""
            document.getElementById("train" + i.toString() + "platform").innerHTML = "Wait"
            document.getElementById("train" + i.toString() + "image").src = imgSources.wait
        } // Platform Labels //
        
        document.getElementById("train" + i.toString() + "callingAtLabel").innerHTML = "Calling at:"
        stationsProcessed = false
        getTrainData(i)
        

    }
}

