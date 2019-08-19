var globalMap, globalOutput, myJson;
var attrArray = ['STUSPS','NAME','tot1950','tot1960','tot1970','tot1980','tot1990','tot2000','tot2010','Grand_Tota'];
var expressed = attrArray[0];

//createMap builds the map, returns the variable globalMap, and establishes a constant, map
function createMap(){
	//create the map
    const map = L.map('map', {
            center: [32.38, -84.00],
            zoom: 5.5,
            minZoom: 6
    });

    globalMap = map;
    //add dark and light OSM base tilelayers
    //let controlLayers = L.control.layers().addTo(map);
    var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    }).addTo(map);

        //call getData function
        getData(map);
    };

//getData loads the geoJSON data into a readable format
function getData(map){
  $.getJSON('data/REGION4.geojson', function(data){

    //style each census tract with the appropriate color and outline properties
    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    //default layer style for each census tract
    function style(feature) {
        return {
            weight: 0.6,
            opacity: 0.8,
            color: 'white',
            fillOpacity: getOpacity(feature.properties.Grand_Tota),
            fillColor: getColor(feature.properties.Grand_Tota)
        };
    };

    //choropleth color map based on tot1950 (reversed to accurately portray affordability)
    function getColor(b){
        return b >=0 & b <= 9 ? '#f0f9e8':
               b >=10 & b <=19 ? '#bae4bc':
               b >=20 & b <=49 ? '#7bccc4':
               b >=49 & b <=120 ? '#43a2ca':
               '#A8DDB5';

    };

    //opacity is determined on tot1960 with greater walkability being more opaque
    function getOpacity(o){
        return o >= 0 & o <=10 ?  .8:
               o >= 10.01 & o <= 20 ? .8:
               o >= 20.01 & o <= 50 ? .8:
               o >= 50.01 & o <= 120 ? .8:
               0.5;
    };

    //iterate through each feature in the geoJSON
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    };

    //set the highlight on the map
    function highlightFeature(e) {

        var layer = e.target;
        layer.setStyle({fillOpacity: 1.0});

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        };

        info.update(layer.feature.properties);
    };

    function resetHighlight(e) {
        geojson.setStyle(style);

        info.update();
    };

    //build chart for the map
    var newChart = function(labels, totData50, totData60, totData70, totData80, totData90, totData00, totData10) {
    var dataLength = labels ? labels.length : 0;
    var backgroundColors = ['#cc5500',
                            ];
    var colors = [];
    for (var i = 0; i < dataLength; i++) {
        colors.push(backgroundColors[i]);
    };
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx,{
            type: 'bar',
            data: {
                //labels: ['Affordability | Walkability'],
                datasets: [{
                    label: '1950s',
                    data: totData50,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1960s',
                    data: totData60,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1970s',
                    data: totData70,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1980s',
                    data: totData80,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '1990s',
                    data: totData90,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '2000s',
                    data: totData00,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
                },{
                    label: '2010s',
                    data: totData10,
                    backgroundColor: backgroundColors[0],
                    borderColor: "#999",
                    borderWidth: 1
              }]
            },
            options: {
                responsive:true,
                tooltips:{enabled:false},
                legend:{display:false},
                title:{display:true,position:'top',text:"Total Disasters by Decade"},
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    };

    var info = L.control({position: 'bottomright'});

    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function(props) {
        if (props) {
            {
                var labels = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];
                var totData50 = [props.tot1950];
                var totData60 = [props.tot1960];
                var totData70 = [props.tot1970];
                var totData80 = [props.tot1980];
                var totData90 = [props.tot1990];
                var totData00 = [props.tot2000];
                var totData10 = [props.tot2010];
                var indices = '';
                indices += '<canvas id="myChart" width="300" height="250"></canvas>';
                this._div.innerHTML = indices;
                newChart(labels, totData50, totData60, totData70, totData80, totData90, totData00, totData10);
            }
        }
    };

    info.addTo(map);


   d3.queue()
    .defer(d3.csv, 'data/FEMA.csv')
    .defer(d3.json, 'data/REGION4.geojson')
    .await(callback);

    function callback(error, csvData, colorado){

      //set up hover events
      handleHover(csvData);
    };
  });
};

//create hover effect function and data acquisition from csv
function handleHover(data){
	document.querySelectorAll("svg path").forEach((path, index) => {
    	let row = data[index],
            tot1950 = row.tot1950,
            tot1960 = row.tot1960,
            tot1970 = row.tot1970,
            tot1980 = row.tot1980,
            tot1990 = row.tot1990,
            tot2000 = row.tot2000,
            tot2010 = row.tot2010,
            geoid10 = row.NAME;
      	path.setAttribute("data-tot1950", tot1950);
      	path.setAttribute("data-tot1960", tot1960);
        path.setAttribute("data-tot1960", tot1970);
        path.setAttribute("data-tot1960", tot1980);
        path.setAttribute("data-tot1960", tot1990);
        path.setAttribute("data-tot1960", tot2000);
        path.setAttribute("data-tot1960", tot2010);
      	path.setAttribute("data-NAME", geoid10);
      	path.addEventListener("mouseenter", handleMouseenter);
      	path.addEventListener("mouseleave", handleMouseleave);
    });
};

//function for mouse entering particular path
function handleMouseenter(e){
    // Send lng,lat to reverse geocoder.
    fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${e.latlng.lng},${e.latlng.lat}`)
        .then(res => res.json())
        .then(myJson => {
        (myJson.address.City + ', ' + myJson.address.Region)
        });

  	let tot1950 = e.currentTarget.getAttribute("data-tot1950"),
        tot1960 = e.currentTarget.getAttribute("data-tot1960"),
        geoid10 = e.currentTarget.getAttribute("data-NAME");
  	//globalOutput.textContent = `${myJson}, Census Block: ${geoid10}, Location Index: ${tot1950}, Walk Index: ${tot1960}`;
}
//function for mouse leaving particular path
function handleMouseleave(e){
    //globalOutput.textContent = 'Census Block: , Location Index: , Walk Index:';
}

//createPopup creates a popup with the LAI, WI, and CB# displayed for the reader

//when the page loads, AJAX & call createMap to render map tiles and data.
$(document).ready(init);
function init(){
  	globalOutput = document.querySelector("header output");
    //globalOutput.textContent = 'Census Block: , Location Index: , Walk Index:`';

    createMap();
  	//create map home button
  	$("header button").on("click", function(){
    	globalMap.flyTo([32.38, -84.00], 6); //[lat, lng], zoom
    });
};

					}
						
				if (properties[attribute] > max) { 
						max = properties[attribute]; 
					}
				}
			}
		}
		return {
			timestamps : timestamps,
			min : '1987',
			max : '2018'
		}
	}
            
            <!--DEFINE FUNCTIONS (sym)-->
	function createPropSymbols(timestamps, data) {
		
        
        
		SDisplay = L.geoJson(data, {
            style: { 
			
				 fillColor: "#708598",
				 color: "#537898",
				 weight: 1, 
				 fillOpacity: 0.6 
            
            },
            onEachFeature: function(feature, featureLayer) {
                featureLayer.bindPopup(feature.properties.attributes)
            }
			}).addTo(SimpleDisplay);
        
        
        
        CDisplay = L.geoJson(data, {
            style: {
				 weight: 1, 
				 fillOpacity: 0.6 
				},
            onEachFeature: function(feature, featureLayer) {
                featureLayer.bindPopup(feature.properties.attributes)
            }
			}).addTo(ColorDisplay);
		updatePropSymbols(timestamps[0]);
	}
            
            
<!--DEFINE FUNCTIONS (updatesym)-->
	function updatePropSymbols(timestamp) {
        
		
		CDisplay.eachLayer(function(layer) {
            
	
			var props = layer.feature.properties;
			var calldata = calcPropcalldata(props[timestamp]);
            var colors = getColor(props[timestamp]);
			var popupContent = "<b>" + String(props[timestamp]) + 
					" CPI</b><br>" +
					"<i>" + props.Name +
					"</i> in </i>" + 
					timestamp + "</i>";
			layer.bindPopup(popupContent, { offset: new L.Point(0,-calldata) });
            layer.setStyle({color :colors});
		});
        
        SDisplay.eachLayer(function(layer) {
            
	
			var props = layer.feature.properties;
			var calldata = calcPropcalldata(props[timestamp]);
			var popupContent = "<b>" + String(props[timestamp]) + 
					" CPI</b><br>" +
					"<i>" + props.Name +
					"</i> in </i>" + 
					timestamp + "</i>";
			layer.bindPopup(popupContent, { offset: new L.Point(0,-calldata) });
		});
	}
<!--wat-->
	function calcPropcalldata(attributeValue) {
		var scaleFactor = 5;
		var area = attributeValue * scaleFactor;
		return Math.sqrt(area/Math.PI)*2;			
	}
 function getColor(d) {
    return d > 275 ? '#01004d' :
           d > 250  ? '#49006a' :
           d > 225  ? '#7a0177' :
           d > 200  ? '#ae017e' :
           d > 175   ? '#dd3497' :
           d > 150   ? '#f2559c' :
           d > 125   ? '#f768a1' :
           d > 100  ? '#fa9fb5' :
           d > 75  ? '#faa7a0' :
           d > 50  ? '#fcc5c0' :
           d > 30   ? '#ffd3cf' :
           d > 20   ? '#fcc5c0' :
           d > 10   ? '#fde0dd' :
           d > 5  ? '#fff1ed' :
           d > 2  ? '#fff7f3' :
           d > 1  ? '#fff7f3' :
                      '#FFEDA0';
    }    
            
//--DEFINE FUNCTIONS (lgnd)-->
        
/* function createLegend(min, max) {
		 
		if (min < 10) {	
			min = 10; 
		}
		function roundNumber(inNumber) {
				return (Math.round(inNumber/10) * 10);  
		}
		var legendS = L.control( { position: 'bottomright' } );
		legendS.onAdd = function(map) {
		var legendContainer = L.DomUtil.create("div", "legend");  
		var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
		var classes = [roundNumber(10), roundNumber((400-10)/2), roundNumber(400)]; 
		var legendCircle;  
		var lastcalldata = 0;
		var currentcalldata;
		var margin;
		L.DomEvent.addListener(legendContainer, 'mousedown', function(e) { 
			L.DomEvent.stopPropagation(e); 
		});  
		$(legendContainer).append("<h2 id='legendTitle'>City CPI</h2>");
		
		for (var i = 0; i <= classes.length-1; i++) {  
			legendCircle = L.DomUtil.create("div", "legendCircle");  
			
			currentcalldata = calcPropcalldata(classes[i]);
			
			margin = -currentcalldata - lastcalldata - 2;
			$(legendCircle).attr("style", "width: " + currentcalldata*2 + 
				"px; height: " + currentcalldata*2 + 
				"px; margin-left: " + margin + "px" );				
			$(legendCircle).append("<span class='legendValue'>"+classes[i]+"</span>");
			$(symbolsContainer).append(legendCircle);
			lastcalldata = currentcalldata;
		}
		$(legendContainer).append(symbolsContainer); 
		return legendContainer; 
		};
		legendS.addTo(map);  
	} // end createLegend();*/ 
         
//--DEFINE FUNCTIONS (ui)-->
/*function createSliderUI(timestamps) {
	
		var sliderControl = L.control({ position: 'bottomright'} );
		sliderControl.onAdd = function(map) {
			var slider = L.DomUtil.create("input", "range-slider");
	
			L.DomEvent.addListener(slider, 'mousedown', function(e) { 
				L.DomEvent.stopPropagation(e); 
			});
			$(slider)
				.attr({'type':'range', 
					'max': timestamps[31], 
					'min': timestamps[0], 
					'step': 1,
					'value': String(timestamps[0])})
		  		.on('input change', function() {
		  		updatePropSymbols($(this).val().toString());
		  			$(".temporal-legend").text(this.value);
		  	});
			return slider;
		}
		sliderControl.addTo(map)
		createTemporalLegend(timestamps[0]); 
	}*/
            
            
    
/*--DEFINE FUNCTIONS (tl)-->
	function createTemporalLegend(startTimestamp) {
		var temporalLegend = L.control({ position: 'bottomright' }); 
		temporalLegend.onAdd = function(map) { 
			var output = L.DomUtil.create("output", "temporal-legend");
 			$(output).text(startTimestamp)
			return output; 
		}
		temporalLegend.addTo(map); 
	}*/
            
            var variableops = {
                "Color Symbols": ColorDisplay,
                "Simple Symbols": SimpleDisplay
            }
            
            
       // Add requested external GeoJSON to map
            var kyCounties = L.geoJSON(counties.responseJSON).addTo(map);     
            var toggs = L.control.layers(variableops).addTo(map);
        
        })
      
	.fail(function() { alert("There has been a problem loading the data.")});            
