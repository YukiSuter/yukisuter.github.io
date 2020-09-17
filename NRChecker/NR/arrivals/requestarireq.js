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




	

// CLOCK START
function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('clock').innerHTML =
	"Time now: " + h + ":" + m + ":" + s;
	var t = setTimeout(startTime, 500);
}
function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}	

function makeDepartureRequest(statnam) {
	
	
	var lookup_station = pedjson[statnam.value]
	
    var data = null
    
    var Http = new XMLHttpRequest


    var national_rail_api_key = '55f26e55-359a-4e6f-aa6c-f0d5e9e1ee19'

    var url = "https://cors-escapey.herokuapp.com/https://api.departureboard.io/api/v2.0/getArrivalsByCRS/" + lookup_station + "/?apiKey=" + national_rail_api_key;
  

    Http.open('GET', url, true)

    Http.send() 


    Http.onreadystatechange = processRequest;
 
    function processRequest(e) {
        if (Http.readyState == 4) {
            data = JSON.parse(Http.responseText)
            console.log(data)
            // CREATE TABLE BASED ON NUMBER OF DEPARTURES
            checktable()
            var tbl = document.createElement("table");
            var tblBody = document.createElement("tbody");
            var body = document.getElementById("maincontainer")
            var delquan = 0
            var tablesize = 13
            var row = 0
            var services = 0

            if (data.nrccMessages != null) {
                for (var j = 0; j < 8; j++) {
					console.log(j)
                    document.getElementById("mes"+[j]).innerHTML = ""
                }
                document.getElementById("mestitle").innerHTML = "Message:"
                if (data.nrccMessages.length < 2) {
                    document.getElementById("mes0").innerHTML = data.nrccMessages[0].message
                } else {
                    document.getElementById("mes0").innerHTML += data.nrccMessages[0].message
                    for (var j = 0; j < data.nrccMessages.length; j++) {
                        document.getElementById("mes"+[j]).innerHTML = data.nrccMessages[j].message
                    }
                }
            } else {
                for (var j = 0; j < 8; j++) {
                    document.getElementById("mes"+[j+1]).innerHTML = ""
                }
                document.getElementById("mestitle").innerHTML = ""
            }
            
            if (data.trainServices != null) {
                services = data.trainServices.length
                delquan = 0
                document.getElementById("stationname").innerHTML = "Arrivals at " + data.locationName + ":";
                

                tbl.id = "arrivals"

                for (var h = 0; h < data.trainServices.length; h++) {
                    if (checkdelay(data.trainServices[h])) {
                        delquan += 1
                    }
                }
                
                if (services + delquan > 11) {
                    tablesize = 12
                } else {
                    tablesize = services + delquan + 1
                }

                var serviceno = 0
                console.log("table is size: " + tablesize)
                // creating all cells
                for (var i = 0; i < tablesize ; i++) {
                    console.log(services  + "services arrive at this station")
                    // creates a table row
                    var schedtime = ""
                    var destination = ""
                    var estitime = ""
                    var platform = ""
                    console.log("on service number " + (serviceno))
					
                    var row = null
                    
                    if (i > 0) {
                        
						schedtime = data.trainServices[serviceno].sta
						estitime = data.trainServices[serviceno].eta
						platform = data.trainServices[serviceno].platform

						if (platform == null) {
							platform = "-"
						}

						destination = data.trainServices[serviceno].origin[0].locationName
						if (data.trainServices[serviceno].origin.length > 1) {
							for (var j = 1; j < data.trainServices[serviceno].origin.length; j++) {
								destination += " & " + data.trainServices[serviceno].origin[j].locationName 
							}
						}
						if (data.trainServices[serviceno].origin[0].via != null) {
							destination += " " + data.trainServices[serviceno].origin[0].via
						}
						var tableinfo = {
							0 : schedtime,
							1 : destination,
							2 : platform,
							3 : estitime
						}
						console.log("adding to row " + i)
						row = createrow(tableinfo, i, false)
						tblBody.appendChild(row);
						if (data.trainServices[serviceno].delayReason != null) {
                            destination = data.trainServices[serviceno].delayReason
							console.log("i before: " + i)
							i += 1
							console.log("i after: " + i)
                            var tableinfo = {
                                0 : "",
                                1 : destination,
                                2 : "",
                                3 : ""
                            }
                            var row = createrow(tableinfo, i, true)
							tblBody.appendChild(row);
                        } 


                        serviceno += 1

                    } else {
                        row = createrow(tableinfo, i, false)
						tblBody.appendChild(row);
                    }

                    // add the row to the end of the table body
                    
                    
                }
            } else {
                document.getElementById("stationname").innerHTML = "There are currently no services arriving at " + data.locationName + ". Please check the national rail website for more information.";

            }

            // put the <tbody> in the <table>
            tbl.appendChild(tblBody);
            // appends <table> into <body>
            
            // sets the borde
            tbl.bgColor="black"
            tbl.cellPadding = "5px";
            tbl.style = "height:" + (((tablesize + 1) / 13) * 100) + ";width:100%"

            var clock = document.getElementById("clock")

            body.appendChild(tbl)
            body.insertBefore(tbl, clock);
        }
    }
}

function checktable() {
    if (document.getElementById("arrivals")) {
        document.getElementById("arrivals").parentNode.removeChild(document.getElementById("arrivals"))
     }
}

function createrow(text, rown, isdelay) {
    var row = document.createElement("tr");
    for (var j = 0; j < 4; j++) {
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        var cellText = null
        var cell = document.createElement("td");
        if (rown != 0) {
            console.log(rown)
            cellText = document.createTextNode(text[j]);
            
            cell.appendChild(cellText);
            row.appendChild(cell);
            if (j == 0) {
                cell.style = "font-weight:bold;width:5%;color:white"
            }
            if (j == 1) {
                if (isdelay != false) {
                    cell.style = "font-weight:bold;width:80%;color:white;"
                } else {
                    cell.style = "font-weight:bold;width:80%;color:yellow;"
                }
            }
            if (j == 2) {
                cell.style = "font-weight:bold;width:3%;color:white"
                cell.style.textAlign = "right"
            }
            if (j == 3) {
                cell.style = "font-weight:bold;width:12%;color:white"
            }
            cell.style.fontSize = "40px"

            adddata(row,rown)

        } else {
            var tabletitles = {
                0 : "Time",
                1 : "Origin",
                2 : "Plat",
                3 : "Estimated"
            }
            cellText = document.createTextNode(tabletitles[j]);
            
            cell.appendChild(cellText);
            row.appendChild(cell);
            if (j == 0) {
                cell.style = "font-weight:bold;width:5%;color:white"
            }
            if (j == 1) {
                if (isdelay != false) {
                    cell.style = "font-weight:bold;width:80%;color:white;"
                } else {
                    cell.style = "font-weight:bold;width:80%;color:white;"
                }
            }
            if (j == 2) {
                cell.style = "font-weight:bold;width:3%;color:white"
                cell.style.textAlign = "right"
            }
            if (j == 3) {
                cell.style = "font-weight:bold;width:12%;color:white"
            }
            cell.style.fontSize = "20px"
            cell.bgColor = "blue"
        }
    }
    return row
}


function checkdelay(service) {
    if (service.delayReason != null) {
        return true
    }
}

function adddata(row, rown) {
    arnum = rown - 1

    for (var k = 0; k < arnum; k++) {
    }
}

