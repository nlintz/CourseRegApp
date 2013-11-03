var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', function($scope){
	var userStub = {name:"Sharon Grimshaw", major:"Design", yog:"2015"};
	$scope.user = userStub;

	var majorReqsStub = [{className:"HFID", available:true},{className:"RPRM", available:true},{className:"ADE", available:false}];
	var genReqsStub = [{className:"Probstat", available:true},{className:"Design Depth", available:true},{className:"FBE", available:false}];

	$scope.majorReqs = majorReqsStub;
	$scope.genReqs = genReqsStub;

	$scope.user.schedule = [{className: "approx"}, {className: "dynamics"}];
}]);

controllers.controller('ClassListController', ['$scope', 'ClassesStub', function($scope, ClassesStub){
	var classes = ClassesStub.data;

	//Preprocess data to convert strings to booleans
	angular.forEach(classes, function(classModel){
		angular.forEach(classModel.sections, function(section){
			section.available = (section.available == 'true') ? true : false
		});
	});
	$scope.classList = classes;

}]);