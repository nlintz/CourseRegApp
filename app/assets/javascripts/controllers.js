var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', function($scope){
	var userStub = {name:"Sharon Grimshaw", major:"Design", yog:"2015"};
	$scope.user = userStub;
}]);