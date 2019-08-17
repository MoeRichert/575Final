
function initialize(){
	getData();
};

// global layers
var SimpleDisplay = L.layerGroup();
var OtherDisplay = L.layerGroup();

// global variables
var expressedField;
var attributes;
var sliderval;
var mymap;
var width = 500,
    height = 600;

    //create new svg container for the map
var map = d3.select("body")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoMercator()
    .scale(300)
    .translate([width / 3, height / 2]);

//scales
var x = d3.scaleLinear()
    .range([])
    .domain([]);

var y = d3.scaleLinear()
    .range([])
    .domain([]);

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
        var procallStates = topojson.feature(usStates, usStates.objects.US_States),
            procselectStates = topojson.feature(selectStates, selectStates.objects.States),
            procCounties = topojson.feature(county, county.objects.Counties).features;

    //attribute array
        attrArray = CSVATTRIBUTES

        //join csv data to GeoJSON
        CountiesData = mergeData(procCounties, csvData, attrArray);

    //process for leaflet
    var states = new L.GeoJSON.AJAX(procallStates, {style: statesStyle});
    var seStates = new L.GeoJSON.AJAX(proselectStates, {style: seStyle});
    var counties = new L.GeoJSON.AJAX(procCounties, {style: countyStyle}).bringToBack();


    createMap(map, states, seStates, counties, csvData, CountiesData);
    createCharts();
    createTogglesorDropdowns();

}; //callback

}; // close to getData

window.onload = createMap();
// sets map element and its properties
function createMap(map, background, largegroup, zoomgroup, csvData, georefData){

// create map, map div, and map's initial view
	mymap = L.map('map', {
        // set map boundaries
        // Set latitude and longitude of the map center
        center: [33.836082, -81.163727],
        // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
        zoom: 4,
        layers: [SimpleDisplay]

        addData(mymap, states, seStates, counties, csvData);
			)}
    });

function addData(mymap, background, largegroup, zoomgroup, csvData){
    // tile layer
    basemap.addTo(mymap);

	// add navigation bar to the map
	L.control.navbar().addTo(mymap);

	//add southern states
    seStates.addTo(mymap).bringToFront();

	// add state borders
    states.addTo(mymap).bringToBack();

	// when the map zooms, change the display level
	mymap.on('zoomend', function (e) {
		changeLayers(mymap);
	});
	layers(mymap, states, seStates, counties, csvData);

};
// close to addData

// Changes layers based on the zoom level
function changeLayers(mymap) {
	if (mymap.getZoom() >= 6) {
		//mymap.removeLayer(sestates);
		sestates.bringToBack();
		counties.addTo(mymap).bringToBack();
	} else if (mymap.getZoom() < 6) {
		mymap.removeLayer(counties);
		//sestates.bringToBack();
	};
};

// function to add the initial layer
function layers() {
	var allLayers = {};

	//set marker style options to variable

	//geoJSON layer with leaflet is created to add data to the map

		//pointToLayer is used to change the marker features to circle markers,

			// event listeners to open popup on hover
	};

	//function to size the overlay data according to total events

		//assign total disasters property to variable
		var props = ;

		// calculate radius
		var radius = calcPropRadius(props);

		//the radius is set to the data layer
		layer.setRadius(radius);
	});

		//geoJSON layer with leaflet is created to add data to the map

		//pointToLayer is used to change the marker features to circle markers,

			// event listeners to open popup on hover
	};

	//function to size the overlay data according to total events

		//assign total disasters property to variable
		var props = ;

		// calculate radius
		var radius = calcPropRadius(props);

		//the radius is set to the data layer
		layer.setRadius(radius);
	});

//REPEAT WITH DATA AS NEEDED


	//leaflet overlay control to add the overlay data
	var totalEventsOverlay = {
	"<span class = 'overlayText'>State Total Natural Disasters</span>": allLayers.stateTotalEventsLayer //& allLayers.countyTotalEventsLayer
	};
	var 1 = {
	"<span class = 'overlayText'>1</span>": layer1
	};
	var 2 = {
	"<span class = 'overlayText'>2</span>": layer2
	};
	var 3 = {
	"<span class = 'overlayText'>3</span>": layer3
	};
};


	var activeLayer;

	//responsive data display per zoom level

	//update charts

	//call dropdown

}; // close to layers function


// function to create the Proportional Symbols map legend
// close to createLegend function


// updates the temporal legend with new content

// Calculate the max, mean, and min values for a given attribute
function getCircleValues(mymap, attribute){

  // start with min at highest possible and max at lowest possible number
  var min = Infinity,
      max = -Infinity;

  // for each layer
  mymap.eachLayer(function(layer){
    //get the attribute value
    if (layer.feature){
      var attributeValue = Number(layer.feature.properties[attribute]);

      //test for min
      if (attributeValue < min){
        min = attributeValue;
      };

      //test for max
      if (attributeValue > max){
        max = attributeValue;
      };
    };
  });

  //set mean
  var mean = (max + min) / 2;

  //return values as an object
  return {
    max: max,
    mean: mean,
    min: min
  };
}; // close to getCircleValues


// function creates sequencing controls

	// create a sequence control variable

    onAdd: function (mymap) {

      // create the control container div with a particular class name

      //creates range input element (slider)

      //add forward and reverse buttons


      return container;

    } // close to onAdd
  }); // close to Sequence Control

  // add the Sequence Control to the map
  mymap.addControl(new sequencer());

	//set slider attributes


  // input listener for slider

    // update the proportional symbols based off of the slider
    updatePropSymbols(mymap, attributes[index]);
  });

  // when the skip button is clicked
  $('.skip').click(function(){
    // get the old index value
    var index = $('.range-slider').val();
    // if forward button is clicked
    if ($(this).attr('id') == 'forward'){
      // increment index
      index++;
      // if past the last attribute, wrap around to first attribute
      index = index > 16 ? 0 : index;
    } else if ($(this).attr('id') == 'reverse'){ // if reverse button is clicked
      // decrement index
      index--;
      // if past the first attribute, wrap around to last attribute
      index = index < 0 ? 16 : index;
    };

    // update slider
    $('.range-slider').val(index);

		var number = 2000 + index;
		attributes[index] = expressedField+"_"+number;
		sliderval = index;
		//console.log("attributes[index]: " + attributes[index]);

    // update the proportional symbols based off of the skip buttons clicked
    updatePropSymbols(mymap, attributes[index]);

  }); // close to '.skip' click function
};


// function to resize proportional symbols according to new attribute values
function updatePropSymbols(mymap, attribute){

  // for each layer of the map
  mymap.eachLayer(function(layer){
    // if the layer contains both the layer feature and properties with attributes
    if (layer.feature && layer.feature.properties[attribute]){
			// access feature properties

      var props = layer.feature.properties;

      var attValue = Number(props[attribute]);
      // radius
      var radius = calcPropRadius(attValue);
      // set the updated radius to the layer
      layer.setRadius(radius);
      // new Popup
      var popup = new Popup(props, layer, radius);
      //add popup to circle marker
      popup.bindToLayer();
      //event listeners to open popup on hover
      layer.on({
        mouseover: function(){
          this.openPopup();
        },
        mouseout: function(){
          this.closePopup();
        },
        click: function(e){
            clickZoom(e);
        }

      }); // close to layer.on
    }
		// close to if statement
  }); // close to eachLayer function
  updateLegend(mymap, attribute); // update the temporal-legend
}; // close to updatePropSymbols function


// adds the baseLayers back to the map after all layers have been removed by
// the dropdown event listener
function baseLayers(mymap) {
		basemap.addTo(mymap);
		ustates.addTo(mymap).bringToBack();
		sestates.addTo(mymap).bringToFront();

		if (mymap.getZoom() >= 6) {
			mymap.addLayer(counties);
		};

		mymap.on('zoomend', function (e) {
			changeLayers(mymap, sestates, counties);
		});
}; //close to baseLayers


// build an attributes array for the data
function processData(data){

  // empty array to hold attributes
  var attributes = [];

  // properties of the first feature in the dataset
  var properties = data.features[0].properties;

  // push each attribute name into attributes array
  for (var attribute in properties){

    // only use total events to start
		if (attribute.indexOf(expressedField) > -1){
      attributes.push(attribute);
		};

  }; // close to for loop

  // return the array of attributes that meet the if statement to be pushed
  return attributes;

}; // close to processData


// add circle markers for point features to the map

//create searchable layer
	var Symbols = L.geoJson(JSON, {
    pointToLayer: function(feature, latlng, mymap){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(mymap);

  // call search function
  search();

//removes county symbols because we only want to display the states at map initialization
	mymap.removeLayer(countySymbols);

}; // close to createPropSymbols

//zoom function
function clickZoom(e) {
  console.log(e.target.feature.properties['Location']);
	if (mymap.getZoom() < 6) {
        mymap.setView(e.target.getLatLng(), 6);
	} else {
		mymap.setView(e.target.getLatLng(), 8);
  }
};

// define funtion to create the search control
function search (mymap, propSymbols, Symbols){
  // new variable search control
  var searchLayer = new L.Control.Search({
    position: 'topright',  // positions the operator in the top left of the screen
    layer: L.featureGroup([propSymbols,Symbols]),
    propertyName: 'Location',  // search for State name
    marker: false,
    moveToLocation: function (latlng, title, mymap) {
      // set the view once searched to the circle marker's latlng and zoom
      mymap.setView(latlng, 7);
			searchPopup(latlng, title, mymap);
    }
  }); // close move to location

	//function to add a popup when area is searched
	function searchPopup  (latlng, title, mymap){
		console.log('popup');
		var searchPopup = L.popup()
		.setLatLng(latlng)
		.setContent(title)
		.openOn(mymap)
	};

	$("#tab2-1").append(searchLayer.onAdd(mymap));

}; // close to search function


// function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){

  // determine which attribute to visualize with proportional symbols
  var attribute = attributes[0];

  // create marker options
  var options = {
  };
		var layer = L.circleMarker(latlng, options);

  // For each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

  // calculate the radius and assign it to the radius of the options marker.
	var radius = calcPropRadius(attValue);
	layer.setRadius(radius);
  // assign the marker with the options styling and using the latlng repsectively

var props = feature.properties;
	// creates a new popup object
	var popup = new Popup(props, layer, radius);
	//add popup to circle marker
	popup.bindToLayer();

  // return the circle marker to the L.geoJson pointToLayer option
  return layer;

}; // close to pointToLayer function


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

  //scale factor to adjust symbol size evenly
  var scaleFactor = 25;

  //area based on attribute value and scale factor
  var area = attValue * scaleFactor;

  //radius calculated based on area
  var radius = Math.sqrt(area/Math.PI);

  // return the radius of the circle
  return radius;

}; // close to calcPropRadius


// Popup constructor function
function Popup(){

}; // close to Popup function

//dropdpwm
function createDropdown(){
}//close to dropdown

// graph function
{
}



//tooltip

}


// highlight

// highlight2

$(document).ready(initialize);
