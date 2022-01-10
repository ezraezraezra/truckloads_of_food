var ToF = function() {
	var DEBUG = true;

	var foodTruckData = {};

	function log(message) {
		if(DEBUG === true) {
			console.log(message)
		}
	}
	
	function _loadFoodTruckData() {
		// https://stackoverflow.com/questions/18355354/csv-to-json-using-jquery
		$.ajax({
		    url: "https://data.sfgov.org/api/views/rqzj-sfat/rows.csv",
		    dataType: "text",
		    async: false,
		    success: function (csvd) {
		        var entries = $.csv.toObjects(csvd);
		        foodTruckData.entries = entries;
		    },
		    dataType: "text",
		    complete: function () {
		        // call a function on complete 
		    }
		});
	}
	
	function _findFoodTrucks(originLoc, numOfTrucks) {
		var outputOrder = [];
		var output = [];
		
		if(originLoc.lat && originLoc.lon) {
			$.map(foodTruckData.entries, function(entry, index) {
				distanceFromOrigin = _distanceByLatLon(originLoc["lat"], originLoc["lon"], entry["Latitude"], entry["Longitude"]);
				
				sortedInsertLoc = _sortedIndex(outputOrder, distanceFromOrigin);
				
				outputOrder.splice(sortedInsertLoc, 0, {"index":index, "distance": distanceFromOrigin})
			});
			
			$.map(outputOrder, function(entry, index) {
				if(index < numOfTrucks) {
					
					output.push({
						"distance" 			: entry.distance,
						"foodTruckDetails"	: foodTruckData.entries[entry.index] 
					});
				} else {
					return false;
				}
			})
		}
		
		return output;
		
	}
	
	
	function _distanceByLatLon(lat1, lon1, lat2, lon2, unit) {
		// https://stackoverflow.com/questions/51819224/how-to-find-nearest-location-using-latitude-and-longitude-from-a-json-data
	    var radlat1 = Math.PI * lat1/180
	    var radlat2 = Math.PI * lat2/180
	    var theta = lon1-lon2
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    if (dist > 1) {
	        dist = 1;
	    }
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515
	    if (unit=="K") { dist = dist * 1.609344 }
	    if (unit=="N") { dist = dist * 0.8684 }
	    return dist;
	}
	
	function _sortedIndex(array, value) {
		// based on: https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
	    var low = 0,
	        high = array.length;
	
	    while (low < high) {
	        var mid = (low + high) >>> 1;
	        if (array[mid]["distance"] < value) low = mid + 1;
	        else high = mid;
	    }
	    return low;
	}
	
	function _tabulatorData(dataset) {
		return $.map(dataset, function(entry,index) {
			var output = entry.foodTruckDetails
			
			output.proximity_order = index + 1;
			output.distance_miles = entry.distance;
			
			return output;
		});
	}
	
	function _submitClicked() {
		var truckCount = $("#truck_count").val();
		var lat = $("#lat").val();
		var lon = $("#lon").val();
		
		result = _findFoodTrucks({"lat": lat,"lon": lon}, truckCount);
		//result = _findFoodTrucks({"lat": "37.805885350100986","lon": "-122.41594524663745"}, 5);
		
		var tableData = _tabulatorData(result);
		
		var table = new Tabulator("#output_table", {
		    data:tableData, //assign data to table
		    autoColumns:true, //create columns from data field names
		});
	}
	
	function init() {
		// Load CSV as JSON
		_loadFoodTruckData();
		
		$("#submit").on("click", _submitClicked );
	}
	
	$(document).ready(function() {
		init();
	});

}();