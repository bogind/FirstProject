
				// create map object
				
				var map = L.map('map', 
				{center: [31.251155, 34.790096], 
				zoom: 13});
				
				// Add OpenStreetMap and thunderforest tile layers variables
				var OSM = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
				var Thunderforest_neighbourhood = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=278544e7c2664b7cb3d23b7433e96f5c', {
				attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				apikey: '278544e7c2664b7cb3d23b7433e96f5c',
				maxZoom: 22,
				minZoom: 12
				});
				var Thunderforest_transport_dark = L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=278544e7c2664b7cb3d23b7433e96f5c',{
				apikey: '278544e7c2664b7cb3d23b7433e96f5c',
				maxZoom: 22,
				minZoom: 12
				});

				// creating a group layer for the tiles
				
				var baseMaps = {
				"<span style='color: #777777'>Open Street Map</span>": OSM,
				"<span style='color: #478547'>Thunderforest neighbourhood</span>": Thunderforest_neighbourhood,
				"<span style='color: #478547'>Thunderforest <span style='color: #2b2b73'>Transport</span></span>": Thunderforest_transport_dark
				};
				
				// Function to create the popups for the GeoJSON layer
				
				function onEachFeature(feature, layer) {
				if (feature.properties && feature.properties.NUM_timedi) {
				layer.bindPopup(
								"<b># of Obs: </b>" + 
								feature.properties.NUM_timedi + 
								"</br><b> Mean Time Variation: </b>" + 
								
								// rounded to create more informative popups
								
								Math.round(feature.properties.AVG_timedi*10)/10 + 
								" Minutes" + 
								"</br> <b>Range of obs: </b>" + 
								feature.properties.Range +
								" Minutes");
					}
				}
				// Function to create the style for the GeoJSON layer
				
				function style(feature) {
									if(feature.properties.NUM_timedi > 0){
										if(feature.properties.AVG_timedi <= -1) {
											return {color: "#2eb82e", fillOpacity: 0.3, weight: 0.2};
											}	
										else if(feature.properties.AVG_timedi >= 1){				
											return {color: "#b30000", fillOpacity: 0.3, weight: 0.2};
											}
										else if(feature.properties.AVG_timedi < 1 && feature.properties.AVG_timedi > -1){
											return {color: "#33ccff", fillOpacity: 0.3, weight: 0.2};
											}
										}
									else{
										return {color: "gray", fillOpacity: 0.6, weight: 0.3};
										}
									}
				
				
				// read the GeoJSON layer, create control and add to map
				 
				 $.getJSON("../data/BsStat.geojson", function(data) {
				 				var BsStats;
								BsStats = L.geoJSON(data,
								{onEachFeature: onEachFeature,
								style: style
								}).addTo(map);
								var BS = {
									"<span style='color: #008ae6'>Be'er Sheva Mean Time Variation</span>": BsStats 
								};	
								// Add Control objects to map
								// Had to move that here because ajax was too fast for the output to be caught outside
								L.control.layers(baseMaps, BS).addTo(map);
						});
				
				
				// Add Measure and mouse position tools in a Control object
				
				var measureControl = new L.Control.Measure({
					primaryLengthUnit: 'meters',
					secondaryLengthUnit: 'kilometers',
					primaryAreaUnit: 'sqmeters',
					secondaryAreaUnit: 'hectares'
				});
				
				
				measureControl.addTo(map);

				L.control.mousePosition().addTo(map);
				