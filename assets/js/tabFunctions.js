///////////////////////////////////////
//Build the search functionality. <-- REQUIRED TO BE IN INDEX BY ASSIGNMENT
//onload, get the cities for the state, show/hide div
$(document).ready(function(){
    getCities('NY');
    getOrgTypes();

    //show / hide divs during search
    $('.show_hide').showHide({
        speed: 1000,  // speed you want the toggle to happen
        easing: '',  // the animation effect you want. Remove this line if you dont want an effect and if you haven't included jQuery UI
        changeText: 1, // if you dont want the button text to change, set this to 0
        showText: 'View Search',// the button text to show when a div is closed
        hideText: 'Close Search' // the button text to show when a div is open

    });
});

//For now, this will be a select to get the 'tabs' needed for the orgId.
// For the project you will do this with tabs from the jQuery UI.
function getData(id){
//we need to figure out how many 'tabs' or areas of information this type of org has
    $.ajax({
        type:'get',
        async:true,
        url:'proxy.php',
        data:{path:'/Application/Tabs?orgId='+id},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                //output that server is down
                $('#fragment-3').html("Server is down. Please try again later.");
            }else{

                //create a pop up box that contains the tabs
                var myModal = new jBox('Modal',{
                    content: $("#tabs"),
                    position:{
                        x: 'center',
                        y: 'top'
                    },
                    offset:{ //set the offset from the edge
                        y: 50
                    },
                    outside: 'x' //outside of target
                });

                myModal.open(); //open the pop up

                //information for the tabs
                getGeneral(id);
                getLocations(id);
                getTraining(id);
                getTreatment(id);
                getFacilities(id);
                getEquipment(id);
                getPhysicians(id);
                getPeople(id);
            }//close if else
        }//close success
    });//close .ajax func
}//close getData

// This will be called by the changing of the select to get the general information for orgId
function getGeneral(id){
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/General'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                //do something....
            }else{
                //print out the table
                var x='<table>';
                x+= generalInfo(data);
                x+= '</table>';

                $('#output').html(x);
            }
        }
    });
}

function generalInfo(data){
    var name = ifNull($(data).find('name').text());
    var descr = ifNull($(data).find('description').text());
    var email = ifNull($(data).find('email').text());
    var web = ifNull($(data).find('website').text());
    var numMem = ifNull($(data).find('nummembers').text());
    var numcalls = ifNull($(data).find('numcalls').text());

    var x = getRow("Name", name);
    x+= getRow("Description", descr);
    x+= getRow("Email", email);
    x+= getRow("Website", web);
    x+= getRow("Number of members", numMem);
    x+= getRow("Number of calls", numcalls);
    return x;
}



/**
 * gets the necessary information for location
 * @param id
 */
function getLocations(id){
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Locations'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-2').html("No data to show.");
            }else{
                //load the data into arrays in order to print out info
                var type = getArray(data, 'type');

                var x = "<select id='loc-type' name='loc-type'>";

                for(var i = 0; i < type.length; i++){
                    x+= "<option value='"+ i + "'>" + type[i] + "</option>";
                }

                x+= "</select><br>"; //end of select

                //default of sel is 0
                var sel = 0;

                //set up the table, get the data, and close it
                x += "<div id='location-table'><table>";
                x += locationData(sel, data);
                x+= "</table></div>";

                //load the tabular data from x into correct div
                $('#fragment-2').html(x);

                //listens to changes in the select menu to determine the new table info
                var type = document.getElementById("loc-type");
                type.addEventListener('change', function(){
                    sel = $('select[name=loc-type]').val(); //get the value of the chosen select and change the sel variable to equal it

                    //grab the location-table div and empty it
                    var div = $('#location-table');

                    div.empty();//empties the div

                    //fill the information out for the table with corresponding values
                    var y = "<table>";
                    y += locationData(sel, data);
                    y+= "</table>";

                    //add to the location-table div
                    div.html(y);
                });

            }//end else
        }//end success
    });//end ajax
}

/**
 * get lattitude and longitude for the location tab
 */
function getLattLong(address){

    var latLongArry = new Array();

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            latLongArry[0] = latitude;
            latLongArry[1] = longitude;
        }
    });


    return latLongArry;
}

/**
 * get and return requested location data
 * @param sel
 * @param data
 */
function locationData(sel, data){
    //create arrays for needed data
    var address1 = getArray(data, 'address1');
    var address2 = getArray(data, 'address2');
    var city = getArray(data, 'city');
    var state = getArray(data, 'state');
    var phone = getArray(data, 'phone');
    var ttyphone = getArray(data, 'ttyphone');
    var fax = getArray(data, 'fax');
    var latitude = getArray(data, 'latitude');
    var longitude = getArray(data, 'longitude');
    var countyName = getArray(data, 'countyName');

    //create address string
    var addrStr = address1[sel] + " " + address2[sel];
    allAddr = addrStr + " " +city[sel] + ", " +	state[sel];

    //array
    var fullAddress = address1 + "+";
    if(address2 !=+ "" || address2 !== " "){ fullAddress += address2 + "+"; }
    fullAddress += city + "+" + state;
    var latLongArry = getLattLong(fullAddress);

     //print out data for the table
    var x = getRow("Address", addrStr);
    x += getRow("City", city[sel]);
    x += getRow("State", state[sel]);
    x += getRow("Phone", phone[sel]);
    x += getRow("TTYPhone", ttyphone[sel]);//"<tr><td>TTY Phone</td><td>" + ttyphone[sel] +  "</td></tr>";
    x += getRow("Fax", fax[sel]);;
    x += getRow("Latitude", latLongArry[0]);
    x += getRow("Longitude", latLongArry[1]);
    x += getRow("County", countyName[sel]);
    x+= "</table></div>";

    return x;

}//end locationData func


/**
 * gets the information for training
 * @param id
 */
function getTraining(id){
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Training'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-4').html("No data to show.");
            }else{
                //header
                var x = "<h3>Services / Training </h3>";
                //gets count to see if there are results to be read
                var count = $(data).find('count').text();

                if(count !== '0'){
                    var type = getArray(data, 'type');
                    var abbrev = getArray(data, 'abbreviation');

                    x+= "<div id='training-div'><table>";
                    x+= "<tr><th>Type</th><th>Abbreviation</th></tr>";
                    for(var i = 0; i < type.length; i++){
                        x+= getRow(type[i], abbrev[i]);
                    }

                    x+= "</table></div>";
                }else{
                    x+= "<p>No training available</p>";
                }
                $("#fragment-4").html(x);

            }//end else
        }//end success
    }); //end ajax call
}//end  getTraining func

/**
 * get the treatment info and return to the appropiate div
 * @param id
 */
function getTreatment(id){

    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Treatments'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-3').html("No data to show.");
            }else{
                var x = "<h3>Treatments</h3>";
                var count = $(data).find('count').text();

                if(count !== '0'){
                    var type = getArray(data, 'type');
                    var abbrev = getArray(data, 'abbreviation');

                    x+= "<div id='treatment-div'><table>";
                    x+= "<tr><th>Type</th><th>Abbreviation</th></tr>";
                    //get the data to print out
                    for(var i = 0; i < type.length; i++){
                        x+= getRow(type[i], abbrev[i]);
                    }

                    x+= "</table></div>";
                }else{
                    x+= "<p>No treatments available</p>";
                }
                $("#fragment-3").html(x);
            }   //end else
        }//end success
    });//end ajax call

}//end getTreatment

/**
 * get the information for facilities
 * @param id
 */
function getFacilities(id){
    //$('#fragment-5').html('going to get Facilities of '+id);
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Facilities'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-5').html("No data to show.");
            }else{
                var x = "<h3>Facilities</h3>";
                var count = $(data).find('count').text();

                if(count !== '0'){
                    var type = getArray(data, 'type');
                    var quantity = getArray(data, 'quantity');
                    var descrip = getArray(data, 'description');

                    x+= "<div id='facility-div'><table>";
                    x+= "<tr><th>Name</th><th>Quanity</th><th>Description</th></tr>";
                    for(var i = 0; i < type.length; i++){
                        x+= "<tr><td>"+ type[i] +"</td><td>" + quantity[i]+ "</td><td>" + descrip[i] + "</td></tr>";
                    }

                    x+= "</table></div>";
                }else{
                    x+= "<p>No facilities available</p>";
                }
                $("#fragment-5").html(x);
            }//end else
        }//end success
    });//end ajax
}

/**
 * get the equipment information for the id
 * @param id
 */
function getEquipment(id){
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Equipment'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-6').html("No data to show.");
            }else{
                var x = "<h3>Equipment</h3>";
                var count = $(data).find('count').text();

                if(count !== '0'){
                    var type = getArray(data, 'type');
                    var quantity = getArray(data, 'quantity');
                    var descrip = getArray(data, 'description');

                    x+= "<div id='facility-div'><table>";
                    x+= "<tr><th>Name</th><th>Quanity</th><th>Description</th></tr>";
                    for(var i = 0; i < type.length; i++){
                        x+= "<tr><td>"+ type[i] +"</td><td>" + quantity[i]+ "</td><td>" + descrip[i] + "</td></tr>";
                    }

                    x+= "</table></div>";
                }else{
                    x+= "<p>No equipment available</p>";
                }
                $("#fragment-6").html(x);
            }//end else
        }//end success
    });//end ajax
}

/**
 * gets the physician info and prints to the right div
 * @param id
 */
function getPhysicians(id){
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/Physicians'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-7').html("No data to show.");
            }else{
                var x = "<h3>Physicians with Admitting Privileges</h3>";
                var count = $(data).find('count').text();

                if(count !== '0'){
                    var fname = getArray(data, 'fName');
                    var mname = getArray(data, 'mName');
                    var lname = getArray(data, 'lName');
                    var suffix = getArray(data, 'suffix');
                    var phone = getArray(data, ' phone');
                    var license = getArray(data, 'license');

                    x+= "<div id='facility-div'><table>";
                    x+= "<tr><th>Name</th><th>License</th><th>Contact</th></tr>";
                    for(var i = 0; i < fname.length; i++){
                        x+= "<tr><td>"+ fname[i];

                        if(mname[i] !== " "){
                            x+= " " + mname[i];
                        }

                        x+= " " + lname[i];

                        if(suffix[i] !== " "){
                            x+= " " + suffix[i];
                        }
                        x+= " </td><td>" + license[i]+ "</td><td>" + phone[i] + "</td></tr>";
                    }

                    x+= "</table></div>";
                }else{
                    x+= "<p>No physicians available</p>";
                }
                $("#fragment-7").html(x);
            }//end else
        }//end success
    });//end ajax
}

/**
 * get people information and return it to the div
 * @param id
 */
function getPeople(id){
    //$('#fragment-8').html('going to get People of '+id);
    $.ajax({
        type:'get',
        url:'proxy.php',
        data:{path:'/'+id+'/People'},
        dataType:'xml',
        success:function(data){
            if($(data).find('error').length!=0){
                $('#fragment-8').html("No data to show.");
            }else{

                var x = "<h3>People</h3>";
                //draw out site details
                //select values for each site
                //based on site grab persons (below)
                var siteCount = $(data).find('siteCount').text();

                var ppl = [];
                x+= "<select id='people-sel'>"
                var y = "<br><table id='people-table' class='display' cellspacing='0' width='100%'><thead><tr><th>Name</th><th>Role</th></tr></thead>";

                $('site', data).each(function(){
                    x+='<option value="'+$(this).attr('siteId')+'">'+$(this).attr('address')+'</option>';
                    var count =$('personCount', data).text();
                    if(count > 0){
                        $(this).find('person').each(function(){
                            var p = '<tr><td>'+$(this).find('fName').text()+' '+$(this).find('lName').text()+'</td><td>'+$(this).find('role').text()+'</td></tr>';
                            ppl.push(p);
                        });
                    }
                });

                x+="</select><br><div id='people-div'></div>";
                //
                var z = y;
                for(var i = 0; i < ppl.length; i++){
                    z+= ppl[i];
                }
                z+="</table>";


                var div = $('#fragment-8');

                div.html(x);

                $('#people-div').html(z);

                $('#people-sel').change(function(){
                    $('#people-div').empty();
                    var ppl2 = [];
                    $('site', data).each(function(){

                        var count =$('personCount', data).text();
                        if(count > 0){
                            $(this).find('person').each(function(){
                                var p = '<tr><td>'+$(this).find('fName').text()+' '+$(this).find('lName').text()+'</td><td>'+$(this).find('role').text()+'</td></tr>';
                                ppl2.push(p);
                            });
                        }

                        var a = y;
                        for(var j = 0; j < ppl2.length; j++){
                            a+= ppl[i];
                        }
                        a+="</table>";

                        $('#people-div').html(a);
                    });
                });

            }//end else
        }//end success
    });//end ajax
}

/**
 * This function is called when user
 * changes the state select (and onload
 * @param which
 */
function getCities(which){
    if(which == ''){
        $('#orgCitySearch').html('City/Town<input id="cityTown" type="text"/>');
    }else{
        $.ajax({
            type: "GET",
            async: true,
            cache:false,
            url: "proxy.php",
            data: {path: "/Cities?state="+which},
            dataType: "xml",
            success: function(data, status){
                var x='';
                if($(data).find('error').length != 0){
                    //do nothing?
                }else if($(data).find('row').length==0 && which != ''){
                    $('#orgCitySearch').html('City/Town<input id="cityTown" type="text" value="No cities/Towns in "'+which+'"/>');
                }else{
                    x+='<select id="cityTown" name="town"><option value="">--cities--<\/option>';
                    $('row',data).each(
                        function(){
                            x+='<option value="'+$(this).find('city').text()+'">'+$(this).find('city').text()+'<\/option>';
                        }
                    );
                    x+="<\/select>";
                    $('#orgCitySearch').html(x);
                }
            }
        });
    }
}

/**
 * Because the orgTypes could change we load them 'fresh' every time.
 * In reality you should load these in PHP on the server end (saves a
 * round trip) but since this is client...
 */
function getOrgTypes(){
    $.ajax({
        type: "GET",
        async: true,
        cache:false,
        url: "proxy.php",
        data: {path: "/OrgTypes"},
        dataType: "xml",
        success: function(data, status){
            var x='';
            if($(data).find('error').length != 0){
                //do nothing?
            }else{
                x+='<option value="">All Organization Types<\/option>';
                $('row',data).each(
                    function(){
                        x+='<option value="'+$(this).find('type').text()+'">'+$(this).find('type').text()+'<\/option>';
                    }
                );
                //return x;
                $("#orgType").html(x);
            }
        }
    });
}

/**
 * Do a search.
 * so when an org is clicked it will create the select and getGeneral()
 */
function checkSearch(){
    $.ajax({
        type: "GET",
        async: true,
        cache:false,
        url: "proxy.php",
        data: {path: "/Organizations?"+$('#Form1').serialize()},
        dataType: "xml",
        success: function(data, status){
            var x='';
            $('#tabelOutput').html('');
            //$('#pagination').html('');
            if($(data).find('error').length != 0){
                $('error', data).each(
                    function(){
                        x+="error getting data";
                    }
                );
            }else if($(data).find('row').length==0){
                x+="No data matches for: "+$('#orgType').val() + (($('#orgName').val()!='')?" > name: "+$('#orgName').val():"") + (($('#state').val()!='')?" > State: "+$('state').val():"");
                if($('#cityTown').val()=='' || $('#cityTown').val().search(/No cities/)==0){
                    x+="";
                }else{
                    x+=" > City: "+$('#cityTown').val();
                }
                /**********/
                //This is for a Physician - it will be different data coming back
            }else if($("#orgType").val() == "Physician"){
                $("#resultsTitle").html(' ('+$(data).find('row').length+' total found)');
                // build a table of Physician information
                /**********/
            }else{
                //$("#resultsTitle").html(' ('+$(data).find('row').length+' total found)');
                $("#resultsTitle").html(' ('+$(data).find('row').length+' total found)');
                x+="<div><table id=\"myTable\" class=\"tablesorter\" border=\"0\" cellpadding=\"0\" cellspacing=\"1\"><thead><tr><th class=\"header\" style=\"width:90px;\">Type<\/th><th class=\"header\">Name<\/th><th class=\"header\">City<\/th><th class=\"header\">Zip<\/th><th class=\"header\" style=\"width:70px;\">County<\/th><th class=\"header\" style=\"width:40px;\">State<\/th><\/tr><\/thead>";
                x+="<tfoot><tr><th class=\"header\" style=\"width:90px;\">Type<\/th><th class=\"header\">Name<\/th><th class=\"header\">City<\/th><th class=\"header\">Zip<\/th><th class=\"header\" style=\"width:70px;\">County<\/th><th class=\"header\" style=\"width:40px;\">State<\/th><\/tr><\/tfoot>";

                $('row',data).each(
                    function(){
                        x+='<tr>';
                        x+="<td>"+$(this).find('type').text()+"<\/td>";
                        x+="<td style=\"cursor:pointer;color:#987;\" onclick=\"getData("+$(this).find('OrganizationID').text()+");\">"+$(this).find('Name').text()+"<\/td>";
                        x+="<td>"+$(this).find('city').text()+"<\/td>";
                        x+="<td>"+$(this).find('zip').text()+"<\/td>";
                        x+="<td>"+$(this).find('CountyName').text()+"<\/td>";
                        x+="<td>"+$(this).find('State').text()+"<\/td><\/tr>";
                    }
                );
                x+="<\/table>";
            }
            $('#tabelOutput').html(x);

            //puts all the results in the table into a uniform table
            $('#myTable').dataTable( {
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
            });
        }
    });
}

/**
 * Occasionally we will get back 'null' as a value
 * you should NEVER show 'null' in the client - make it blank...
 * @param what
 * @param data
 * @param i
 */
function myFind(what,data,i){
    if(i!=-1){
        return (($(data).find(what).eq(i).text()!='null')?$(data).find(what).eq(i).text()+' ':'')
    }else{
        return (($(data).find(what).text()!='null')?$(data).find(what).text()+' ':'')
    }
}

