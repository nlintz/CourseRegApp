var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', 'User', function($scope, User){
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

controllers.controller('CalendarController', ['$scope', function($scope){
	//TODO REFACTOR INTO ANGULAR SERVICES
	var sortService = new SortService();
	var axesDataService = new AxesDataService();
	var eventsDataService = new EventDataService();

	var stubEvents = [{start:30, end:150}, {start:30, end:200}];
	var sortedEvents = sortService.sortEventsByStartTime(stubEvents);
	var eventsData = eventsDataService.getEventsData(sortedEvents);

	var axesTimings = axesDataService.axesTimings(9, 18, 1);
	var axesData = axesDataService.getAxesData(axesTimings);

	$scope.axesData = axesData;

	angular.forEach(eventsData, function(classEvent){
		classEvent.height = (classEvent.end - classEvent.start)/60;
	});

	$scope.mondayClasses = eventsData;
	$scope.tuesdayClasses = eventsData;

}]);