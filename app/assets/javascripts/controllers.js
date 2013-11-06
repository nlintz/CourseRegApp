var controllers = angular.module('Controllers', []);

function processCourseAvailable(courses){
	angular.forEach(courses, function(course){
		course.available = (course.available == 'true' || course.available == true) ? true : false
	});
}

controllers.controller('RequirementsController', ['$scope', 'ClassesStub', 'User', 'Schedule', function($scope, ClassesStub, User, Schedule){
	//Stubs
	var majorReqsStub = ClassesStub.data;
	var genReqsStub = majorReqsStub;

	processCourseAvailable(majorReqsStub);

	$scope.majorReqs = majorReqsStub;
	$scope.genReqs = genReqsStub;

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
	processCourseAvailable($scope.classList)

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

controllers.controller('CalendarController', ['$scope', 'Schedule', 'ClassesStub', function($scope, Schedule, ClassesStub){
	//TODO REFACTOR INTO ANGULAR SERVICES
	var sortService = new SortService();
	var axesDataService = new AxesDataService();
	var eventsDataService = new EventDataService();

	var calendarEvents = [];
	var dayStart = 9;

	function convertSectionTimeToIntArray(section){
		return [_.map(section.startTime.split(':'), function(time){return parseInt(time, 10)}),
		_.map(section.endTime.split(':'), function(time){return parseInt(time, 10)})];
	}

	function convertSectionTimeToMinutes(section){
		var sectionTime = convertSectionTimeToIntArray(section);
		var startTime = sectionTime[0];
		var endTime = sectionTime[1];

		var startHour = parseInt(startTime[0], 10) - dayStart;
		var endHour = parseInt(endTime[0], 10) - dayStart;
		return {start:startHour*60 + startTime[1], end:endHour*60 + endTime[1]};
	};

	ClassesStub.then(function(data){
		Schedule.addCourse(data.data[0], 1, 1)
		$scope.mondayClasses = Schedule.getCourses()[0].course.sections
	});

	$scope.$watchCollection('user.schedule', function(scheduleElements){
		angular.forEach(scheduleElements, function(scheduleElement){
			angular.forEach(scheduleElement.course.sections, function(section){
				var sectionStartEndTimes = convertSectionTimeToMinutes(section)
				section.start = sectionStartEndTimes.start;
				section.end = sectionStartEndTimes.end;
			});
		});
	});

	

	var stubEvents = [{start:30, end:150}, {start:30, end:200}];
	var sortedEvents = sortService.sortEventsByStartTime(stubEvents);
	var eventsData = eventsDataService.getEventsData(sortedEvents);

	var axesTimings = axesDataService.axesTimings(9, 18, 1);
	var axesData = axesDataService.getAxesData(axesTimings);

	$scope.axesData = axesData;

	$scope.computeHeight = function(courseSection){
		return (courseSection.end - courseSection.start)/60;
	};

	$scope.computeWidths = function(courseSections){
		// var sortedEvents = sortService.sortEventsByStartTime(stubEvents);
		// var eventsData = eventsDataService.getEventsData(sortedEvents);
	};

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
		processCourseAvailable($scope.allCourses)
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
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};
}]);
