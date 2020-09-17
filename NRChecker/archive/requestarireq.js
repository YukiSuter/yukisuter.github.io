//Clock

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

// Dropdow










function refresh(station) {
    console.log(station)
    makeDepartureRequest(station)
    setTimeout(refresh(), 300)
}


function makeDepartureRequest(lookup_station)
{

    
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
            var body = document.getElementsByTagName("body")[0]
            var delquan = 0
            var tablesize = 13
            var row = 0
            var services = 0
            
            if (data.nrccMessages != null) {
                document.getElementById("mestitle").innerHTML = "Message:"
                if (data.nrccMessages.length < 2) {
                    document.getElementById("mes").innerHTML = data.nrccMessages[0].message
                } else {
                    document.getElementById("mes").innerHTML += data.nrccMessages[0].message
                    for (var j = 0; j < data.nrccMessages.length; j++) {
                        document.getElementById("mes"+[j]).innerHTML = data.nrccMessages[j].message
                    }
                }
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
                
                if (services + delquan > 12) {
                    tablesize = 12
                } else {
                    tablesize = services + delquan
                }

                var serviceno = 0
                console.log("table is size: " + tablesize)
                // creating all cells
                for (var i = 0; i < tablesize + 1 ; i++) {
                    console.log(services  + "services leave from this station")
                    // creates a table row
                    var schedtime = ""
                    var destination = ""
                    var estitime = ""
                    var platform = ""
                    console.log("on service number " + (serviceno  + 1))

                    var row = null
                    
                    if (i > 0) {
                        if (data.trainServices[serviceno].delayReason != null) {
                            destination = data.trainServices[serviceno].delayReason
                            var tableinfo = {
                                0 : schedtime,
                                1 : destination,
                                2 : platform,
                                3 : estitime
                            }
                            row = createrow(tableinfo, i, true)
                        } else {
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
                            row = createrow(tableinfo, i, false)
                        }


                        serviceno += 1

                    } else {
                        row = createrow(tableinfo, i, false)
                    }

                    // add the row to the end of the table body
                    tblBody.appendChild(row);
                    
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
            tbl.style = "height:100%;width:100%"

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
                1 : "Destination",
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

