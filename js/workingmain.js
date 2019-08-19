        var statesdata = $.ajax({
            url: "https://raw.githubusercontent.com/MoeRichert/G575Final/9e92fea4a0f1d511eec25e9d1a26ea0523152a7b/data/Test.geojson",
            dataType: "json",
            success: console.log("State data successfully loaded."),
            error: function(xhr) {
                alert(xhr.statusText)
            }
        })
        $.when(statesdata).done(function(data) {
			
            var SimpleDisplay = L.layerGroup();
            var ColorDisplay = L.layerGroup();
            var map = L.map('map', {
                center: [32.38, -84.00],//Coordinated to center the map for southeastern States
                zoom: 5.5,
                layers: [ColorDisplay]
            });
            var basemap = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);
            
            var info = processData(data);
			createPropSymbols(info.timestamps, data);
            
			createLegend(info.min,info.max);
			createSliderUI(info.timestamps);
            
            
            
            
            <!--DEFINE FUNCTIONS (PROCESS DATA)-->
	function processData(data) {
		var timestamps = [];
		var min = Infinity; 
		var max = -Infinity;
		for (var feature in data.features) {
			var properties = data.features[feature].properties; 
			for (var attribute in properties) { 
				if ( attribute != 'id' &&
				  attribute != 'name' &&
				  attribute != 'lat' &&
				  attribute != 'long' ) {
						
					if ( $.inArray(attribute,timestamps) === -1) {
						timestamps.push(attribute);		
					}
					if (properties[attribute] < min) {	
						min = properties[attribute];
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
