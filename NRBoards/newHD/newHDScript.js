var services = [];
var table = [];
var stationsResponseParsed;
var stationsProcessed = false;


const d = new Date();

var imgSources = {ready:"images/platformSet.png", wait:"images/platformWait.png", toc:"images/TOCLogos/"}

var myImages = [], img;

var rowLabels = ["time", "destination", "via", "platformLabel", "platform", "callingAtLabel", "ca0", "ca1", "ca2", "ca3", "ca4", "ca5", "ca6", "ca7", "ca8", "ca9", "ca10", "ca11", "ca12", "ca13", "message", "coaches", "logo"]


// SEARCH BOX //
var request = new XMLHttpRequest();
request.open("GET", ".././stationcodes.json", false);
request.send(null)
var pedjson = JSON.parse(request.responseText);
var arr = Object.keys(pedjson)

function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }


  ///////////////////////////////////////////////////////////////




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

