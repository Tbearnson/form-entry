(function (app){

// Routes
function Config($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('primaryForm', {
		url: '/',
		templateUrl: 'primaryForm.html',
		controller: 'PrimaryFormController as vm',
			
	})
}

// Controllers

function PrimaryFormController(domo,$scope,Data){
	var vm = this;

	// User Object and Full Name
	// vm.username = JSON.parse(window.localStorage.domo_user).FULL_NAME
	vm.username = 'Rachel Stein';

	//Today's date
	vm.date = new Date();


	//CAP #
	$scope.$on('Data:New Cap',function(event,data){
		console.log(Data.cap);
		$scope.$apply(function() {
			vm.capOptions = Data.cap;
		});
	});

	//Location
	$scope.$on('Data:New Location',function(event,data){
		$scope.$apply(function() {
			vm.locationOptions = Data.location;
		});
	});
   
    vm.writeData = Data.writeNewRow;

}

//Configuration
	app
	.config(Config)
	.controller('PrimaryFormController', PrimaryFormController)
	.constant('_', _)
	.constant('domo', domo);

})(angular.module('cmsForm',['ui.router','ui.bootstrap','angular.filter','ngAnimate']));

