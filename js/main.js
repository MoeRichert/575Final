window.onload = initialize();

function initialize(){
	getData();
};

// global layers
//var SimpleDisplay = L.layerGroup();
//var OtherDisplay = L.layerGroup();

//function to translate topojsons

// global variables
var expressed = "Disaster_Type";
//var attributes;
//var sliderval;
//var mymap;
var width = 500,
    height = 600;

    //create Albers equal area conic projection
    //var projection = d3.geoAlbers()
    //    .center([-5.45, 30.87])
    //    .rotate([81.00, 0, 0])
    //    .parallels([29.27, 39.59])
    //    .scale(2371.72)
    //    .translate([width / 2, height / 2]);
    
    //set path
    //var path = d3.geoPath()
    //    .projection(projection);
    
    // clear old
    //    d3.select(".map").select("g").selectAll("path").remove();
    
    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

//scales
//var x = d3.scaleLinear()
//    .range([])
//    .domain([]);

//var y = d3.scaleLinear()
//    .range([])
//    .domain([]);

// assigns the respected geojsons to the apropriate variables
function getData(mymap) {

	d3.queue()
        d3.queue()
        .defer(d3.csv, "data/FEMADeclarations.csv") //load csv
        .defer(d3.json, "data/US_States.topojson") //load background
        .defer(d3.json, "data/States.topojson")
        .defer(d3.json, "data/Counties.topojson") //load analysis spatial data
        .await(callback);
    
function callback(error, csvData, usStates, selectStates, rawCounties){
    
    //translate TopoJSON
        var states = topojson.feature(usStates, usStates.objects.US_States),
            seStates = topojson.feature(selectStates, selectStates.objects.States),
            counties = topojson.feature(rawCounties, rawCounties.objects.Counties).features;
    
    //attribute array
        var attrArray = ("Disaster_Type", "Incident_Type", "County")

        
        //join csv data to GeoJSON
        CountiesData = mergeData(counties, csvData, attrArray);
    
    //add vector data to map
    //    var NAm = map.append("path")
    //        .datum(procallStates)
    //        .attr("class", "state")
    //        .attr("d", path);
    //
    //    var SelStates = map.append("path")
    //        .datum(procselectStates)
    //        .attr("class", "state")
    //        .attr("d", path);
    //    
    //    var CountiesD = map.selectAll(".county")
    //        .data(CountiesData)
    //        .enter()
    //        .append("path")
    //        .attr(expressed, function(d){
    //            return "NAME " + d.properties.expressed;
    //        })
    //        .attr("d", path);
    
//    console.log(CountiesD);
    
    //process for leaflet
    dataprocess (states);
    dataprocess (seStates);
    dataprocess (counties);
    
    var basemap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
    minZoom: 0,
	maxZoom: 20,
	ext: 'png'
    });
    
    createMap(map, states, seStates, counties, csvData, CountiesData);
    //createCharts();
    //createTogglesorDropdowns();
    
}; //callback

}; // close to getData
    
//process for leaflet
    function dataprocess (datum){
        $.ajax(datum, {
            dataType: "json",
            success: function(response){
                //create a Leaflet GeoJSON layer and add it to the map
                L.geoJson(response).addTo(map);
            }
        })};

// sets map element and its properties
function createMap(mapcall, background, largegroup, zoomgroup, csvData, georefData){

// create map, map div, and map's initial view
	mymap = L.map('map', {
        // set map boundaries
        // Set latitude and longitude of the map center
        center: [38.99766, -100.90838],
        // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
        zoom: 4,
        //layers: [SimpleDisplay]
        
        
        
        
    });
                     addData(mymap, states, seStates, counties, csvData)
};
        
function addData(mapcall, background, largegroup, zoomgroup, csvData){    
    // tile layer
    basemap.addTo(mapcall);

	// add navigation bar to the map
	L.control.navbar().addTo(mapcall);
	
	//add southern states
    seStates.addTo(mapcall).bringToFront();
	
	// add state borders
    states.addTo(mapcall).bringToBack();

	// when the map zooms, change the display level
	mymap.on('zoomend', function (e) {
		changeLayers(mapcall);
	});
	//layers(mapcall, background, largegroup, zoomgroup, csvData, county_eventsCSV);
    
};
// close to addData

//define mergedata and append csvdata to county data
function mergeData(geoj, csvd, attribs){
    // append csv attributes to geojson
        for (let i = 0; i < csvd.length; i++) {
            let tblRow = csvd[i]; // get row
            let rowID = tblRow.County; // get row ID
            for (let a = 0; a < geoj.length; a++) {
                let featProperties = geoj[a].properties; // get feature
                let featID = featProperties.Name; // get feature ID
                if (featID == rowID) { // on match...
                    attribs.forEach(function (attribs) {
                        let val = parseFloat(tblRow[attribs]); // get attribute
                        featProperties[attribs] = val; // set attribute
                    });
                }
            }
        }
    return geoj
};



