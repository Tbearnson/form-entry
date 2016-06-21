(function (app){

function PrimaryFormController($scope,$window,Data){
    var pfc = this;

    // User Object and Full Name
    pfc.username = JSON.parse($window.localStorage.domo_user).USER_FULLNAME;
    // pfc.username = 'Jack Sparrow';

    // Today's date
    pfc.date = new Date();

    // CAP #
    Data.getCAPData().then(function(data) {
        pfc.capOptions = data;
    });

    // Location
    Data.getLocationData().then(function(data) {
        pfc.locationOptions = data;
    });

    // Submit new row to dataset
    pfc.submit = function() {
        Data.writeCAPDataRow([
            pfc.username,
            pfc.date.getFullYear()+'-'+
                (pfc.date.getMonth() < 10 ? '0'+(pfc.date.getMonth()+1) : (pfc.date.getMonth()+1))+'-'+
                (pfc.date.getDate() < 10 ? '0'+pfc.date.getDate() : pfc.date.getDate()),
            pfc.cap,
            pfc.location,
            pfc.file,
            pfc.correct
        ]);

        pfc.file = undefined;
        pfc.correct = undefined;
    };
} 

app
.controller('PrimaryFormController', PrimaryFormController)
.constant('AppHost', 'https://cigna.domo.com')
.constant('_', _)
.constant('domo', domo);

})(angular.module('cmsForm',['ui.router','ui.bootstrap','angular.filter','ngAnimate']));

