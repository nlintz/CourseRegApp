var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', function($scope){
	var userStub = {name:"Sharon Grimshaw", major:"Design", yog:"2015"};
	$scope.user = userStub;

	var majorReqsStub = [{className:"HFID", available:true},{className:"RPRM", available:true},{className:"ADE", available:false}];
	var genReqsStub = [{className:"Probstat", available:true},{className:"Design Depth", available:true},{className:"FBE", available:false}];

	$scope.majorReqs = majorReqsStub;
	$scope.genReqs = genReqsStub;
}]);