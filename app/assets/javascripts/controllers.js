var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', 'User', 'Schedule', function($scope, User, Schedule){
	// var userStub = {name:"Sharon Grimshaw", major:"Design", yog:"2015"};
	$scope.user = User;
	
	if (Schedule.courses.length < 3)
	{
		Schedule.addCourse({className:"Class1"},[], 0);
		Schedule.addCourse({className:"Class2"},[], 1);
		Schedule.addCourse({className:"Class3"},[], 2);
	};

	$scope.user.schedule = Schedule.getCourses();

	var majorReqsStub = [{className:"HFID", available:true},{className:"RPRM", available:true},{className:"ADE", available:false}];
	var genReqsStub = [{className:"Probstat", available:true},{className:"Design Depth", available:true},{className:"FBE", available:false}];

	$scope.majorReqs = majorReqsStub;
	$scope.genReqs = genReqsStub;

	$scope.removeClassFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeClassPriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

}]);

controllers.controller('ClassListController', ['$scope', 'ClassesStub', 'User', 'Schedule', function($scope, ClassesStub, User, Schedule){
	$scope.user = User;
	$scope.user.schedule = Schedule.getCourses();

	var classes = ClassesStub.data;

	//Preprocess data to convert strings to booleans
	angular.forEach(classes, function(classModel){
		angular.forEach(classModel.sections, function(section){
			section.available = (section.available == 'true') ? true : false
		});
	});

	$scope.classList = classes;


	$scope.removeClassFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeClassPriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

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