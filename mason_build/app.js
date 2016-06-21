(function (app){
// Controllers

function PrimaryFormController($scope,$window,Data){
    var vm = this;

    // User Object and Full Name
    vm.username = JSON.parse($window.localStorage.domo_user).USER_FULLNAME;

    // Today's date
    vm.date = new Date();

    // CAP #
    Data.getCAPData().then(function(data) {
        vm.capOptions = data;
    });

    // Location
    Data.getLocationData().then(function(data) {
        vm.locationOptions = data;
    });

    // Submit new row to dataset
    vm.submit = function() {
        Data.writeCAPDataRow([
            vm.username,
            vm.date.getFullYear()+'-'+
                (vm.date.getMonth() < 10 ? '0'+(vm.date.getMonth()+1) : (vm.date.getMonth()+1))+'-'+
                (vm.date.getDate() < 10 ? '0'+vm.date.getDate() : vm.date.getDate()),
            vm.cap,
            vm.location,
            vm.file,
            vm.correct
        ]);
    };
}

function Data($http,$rootScope) {
    var the_data = {};
    the_data.writeCAPDataRow = function(new_row) {
        return $http({
            method: 'POST',
            url: '/api/data/v2/datasources/3b0abf69-ff64-43fb-8530-6f62927fb471/data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                dataQuery: "{\"columns\":[{\"column\":\"Name\",\"exprType\":\"COLUMN\"},{\"column\":\"Date\",\"exprType\":\"COLUMN\"},{\"column\":\"CAP Number\",\"exprType\":\"COLUMN\"},{\"column\":\"Location\",\"exprType\":\"COLUMN\"},{\"column\":\"File Number\",\"exprType\":\"COLUMN\"},{\"column\":\"Correctness Flag\",\"exprType\":\"COLUMN\"}],\"groupByColumns\":[],\"orderByColumns\":[],\"limit\":{\"limit\":100000,\"offset\":0}}",
                sqlSerializationContext: "{\"calendar\":\"StandardCalendar\"}"
            }
        })
        .then(function(result) {
            var rows = result.data.rows;
            rows.push(new_row);
            return $http({
                method: 'PUT',
                url: '/api/data/v1/webforms/3b0abf69-ff64-43fb-8530-6f62927fb471',
                data: {
                    id: '3b0abf69-ff64-43fb-8530-6f62927fb471',
                    columns: [{type: "STRING", name: "Name"},{type: "DATE", name: "Date", format: "yyyy-MM-dd"},{type: "STRING", name: "CAP Number"},{type: "STRING", name: "Location"},{type: "STRING", name: "File Number"},{type: "LONG", name: "Correctness Flag"}],
                    name: 'CAP Tick Data',
                    rows: rows
                }
            });
        });
    };

    the_data.getCAPData = function() {
        return $http({
            method: 'POST',
            url: '/api/data/v2/datasources/c7fd3aa5-93c0-4aae-8ba1-116ead80dcee/data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
              dataQuery: "{\"columns\":[{\"column\":\"CAP Number\",\"exprType\":\"COLUMN\"}],\"groupByColumns\":[],\"orderByColumns\":[],\"limit\":{\"limit\":50,\"offset\":0}}",
              sqlSerializationContext: "{\"calendar\":\"StandardCalendar\"}"
            }
        }).then(function(data) {
            var cap_numbers_array = data.data.rows.map(function(item) {return item[0];}).filter(function(item){return item != 'Seed Row';});
            the_data.cap = cap_numbers_array;
            return cap_numbers_array;
        });
    };

    the_data.getLocationData = function() {
        return $http({
            method: 'POST',
            url: '/api/data/v2/datasources/6afca716-7add-45ba-9ea4-1c9e0605f7fa/data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
              dataQuery: "{\"columns\":[{\"column\":\"Location\",\"exprType\":\"COLUMN\"}],\"groupByColumns\":[],\"orderByColumns\":[],\"limit\":{\"limit\":50,\"offset\":0}}",
              sqlSerializationContext: "{\"calendar\":\"StandardCalendar\"}"
            }
        }).then(function(data) {
            var locations = data.data.rows.map(function(item) {return item[0];});
            the_data.locations = locations;
            return locations;
        });
    };

    return the_data;
}


//Configuration
    app
    .controller('PrimaryFormController', PrimaryFormController)
    .factory('Data', Data);

})(angular.module('cmsForm',['ui.router','ui.bootstrap','angular.filter','ngAnimate']));
