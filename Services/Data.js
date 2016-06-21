function Data($http, $rootScope, AppHost, domo) {
	var the_data = {};
	the_data.writeCAPDataRow = function(new_row) {
		return $http({
			method: 'POST',
			url: AppHost + '/api/data/v3/datasources/3b0abf69-ff64-43fb-8530-6f62927fb471/dataversions?append=latest',
			headers: {
				'Content-Type': 'text/csv',
                'X-Domo-Developer-Token': '022423ca85b11d9abae9fb7020b7b6d685db36fac5e733ca'
			},
			data: new_row.join(',')
		})
		.then(function(result) {
			console.log('domo.js post result:', result);
		});
	};

    the_data.getCAPData = function() {
    	return domo.get('/data/v1/cap').then(function(data){
			var cap_numbers_array = data.map(function(item) {return item["CAP Number"]});
			the_data.cap = cap_numbers_array;
			return cap_numbers_array;
		});
    };

    the_data.getLocationData = function() {
        return domo.get('/data/v1/location').then(function(data){
			var location_array = data.map(function(item) {return item["Location"]});
			the_data.location = location_array;
			return location_array;
		});
    };

	return the_data;
}

angular.module('cmsForm')
.factory('Data', Data);