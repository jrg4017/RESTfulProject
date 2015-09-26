<?php
    require_once "assets/includes/header.php";
?>

<body>
<h2>Emergency Services Directory</h2>

<div id="dump"></div>
<hr/>


<div id="tabs" style="display:none;">
    <ul>
        <li><a href="#fragment-1"><span>General</span></a></li>
        <li><a href="#fragment-2"><span>Locations</span></a></li>
        <li><a href="#fragment-3"><span>Treatments</span></a></li>
        <li><a href="#fragment-4"><span>Training</span></a></li>
        <li><a href="#fragment-5"><span>Facilities</span></a></li>
        <li><a href="#fragment-6"><span>Equipment</span></a></li>
        <li><a href="#fragment-7"><span>Physicians</span></a></li>
        <li><a href="#fragment-8"><span>People</span></a></li>
    </ul>
    <div id="fragment-1">
        <table id="output"></table>
    </div>
    <div id="fragment-2">
        <div id="map-canvas"></div>
    </div>

    <div id="fragment-3"></div>
    <div id="fragment-4"></div>
    <div id="fragment-5"></div>
    <div id="fragment-6"></div>
    <div id="fragment-7"></div>
    <div id="fragment-8"></div>
</div>

<script>
    $( "#tabs" ).tabs();
</script>




<div id="slidingDiv" style="display: block;"><!--show open as block to start with-->

    <form  method="post" action="" id="Form1" class="pure-form">
        <fieldset><legend>Search Criteria</legend>
            <p>

                Organization Type
                <select id="orgType" name="type" onchange="(this.value=='Physician')?$('#orgLabel').html('Physician\'s Name'):$('#orgLabel').html('Organization Name')">

                </select>
            </p>

            <p>
                <span id="orgLabel">Organization Name</span>
                <input id="orgName" name="name" type="text"><em style="color: rgb(104, 129, 162);"> *can be partial - "vol" for "Volunteer"</em></p>

            <?php include "assets/includes/states.php" ?>

    <span id="orgCitySearch">
    </span>
            <p>
                County
                <input id="county" type="text"/>
            </p><p>
                ZIP Code
                <input id="zip" type="text" name="zip"/></p>
            <div style="margin:0 0 0 210px"><input value="Show Results" onclick="checkSearch()" id="btnSearch" class="button pure-button" type="button"/>&nbsp;<input type="reset" class="button pure-button" value="Reset Form" onclick="resetAll()"/>
            </div>
        </fieldset>
    </form>
</div><!--end the show hide div -->

<a href="#" class="show_hide button pure-button" rel="#slidingDiv">Close Search</a><!--user clicks to open / close -->
<br>
<br>
<div id="tabelOutput"></div>

</body>
</html>