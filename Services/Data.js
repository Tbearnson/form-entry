function Data($http,$rootScope,domo) {
	var the_data = {};
	the_data.writeNewRow = function(row_data) {
		return 'This is a thing.';
	};

	domo.get('/data/v1/cap').then(function(data){
		var cap_numbers_array = data.map(function(item) {return item["CAP Number"]});
		the_data.cap = cap_numbers_array;
		$rootScope.$broadcast('Data:New Cap',cap_numbers_array)
	});

	domo.get('/data/v1/location').then(function(data){
		var location_array = data.map(function(item) {return item["Location"]});
		the_data.location = location_array;
		$rootScope.$broadcast('Data:New Location',location_array)
	});

	return the_data;
}

angular.module('cmsForm')
.factory('Data', Data);