var controllers = angular.module('Controllers', []);

controllers.controller('RequirementsController', ['$scope', 'ClassesStub', 'User', 'Schedule', function($scope, ClassesStub, User, Schedule){
	//Stubs
	var majorReqsStub = ClassesStub.data;
	var genReqsStub = majorReqsStub;

	angular.forEach(majorReqsStub, function(course){
		angular.forEach(course.sections, function(section){
			section.available = (section.available == 'true' || section.available == true) ? true : false
		});
	});


	$scope.majorReqs = majorReqsStub;
	$scope.genReqs = genReqsStub;
	//

	$scope.user = User;
	$scope.user.schedule = Schedule.getCourses();

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, section, Schedule.getCourses().length);
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeCoursePriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};

}]);

controllers.controller('ClassListController', ['$scope', '$routeParams', 'ClassesStub', 'User', 'Schedule', function($scope, $routeParams, ClassesStub, User, Schedule){
	if ($routeParams.searchQuery){
		$scope.searchQuery = $routeParams.searchQuery;
	};
	
	$scope.user = User;
	$scope.user.schedule = Schedule.getCourses();

	$scope.classList = ClassesStub.data;

	//Data preprocessing for classes
	angular.forEach($scope.classList, function(course){
		angular.forEach(course.sections, function(section){
			section.available = (section.available == 'true' || section.available == true) ? true : false
		});
	});

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, section, Schedule.getCourses().length);
		$scope.user.schedule = Schedule.getCourses();
	};

	//TODO refactor into attribute of classes
	function courseInSchedule(course){
		angular.forEach($scope.user.schedule, function(scheduleElement){
			if (scheduleElement.course == course){
				return true;
			};
		});
		return false;
	};

	$scope.sectionAvailable = function(section){
		return section.available ? true : false;
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
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

controllers.controller('SearchController', ['$scope', '$location', function($scope, $location){
	$scope.searchModel = $scope.searchQuery ? $scope.searchQuery : "";
	$scope.searchForClasses = function(searchModel){
		$location.path('search/'+$scope.searchModel);
	};
}]);

controllers.controller('CourseSidebarController', ['$scope', '$filter', 'Schedule', 'ClassesStub', function($scope, $filter, Schedule, ClassesStub){
	
	ClassesStub.then(function(data){
		$scope.allCourses = data.data;
	});

	$scope.sidebarAddModel = "";

	$scope.addCourseFromSidebar = function(course){
		if ($scope.sidebarAddModel){
			var courseToAdd = $filter('filter')($scope.allCourses, $scope.sidebarAddModel)[0];
			if (courseToAdd.available && !courseToAdd.inSchedule){
				Schedule.addCourse(courseToAdd, 0, Schedule.getCourses().length);
				$scope.sidebarAddModel = "";
				}
			}
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeCoursePriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

	$scope.removeCourseFromSchedule = function(course){
		console.log('getting called')
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};
}]);
