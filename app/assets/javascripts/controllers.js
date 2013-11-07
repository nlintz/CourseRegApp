var controllers = angular.module('Controllers', []);

function processCourseAvailable(courses, Schedule){
	angular.forEach(courses, function(course){
		course.available = (course.available == 'true' || course.available == true) ? true : false;
		// if (course.inSchedule){
		// 	course.inSchedule = true;
		// 	console.log(course.inSchedule)
		// 	// Schedule.addCourse(course)
		// }
	});
};

controllers.controller('RequirementsController', ['$scope', 'angularFire', 'User', 'Schedule', function($scope, angularFire, User, Schedule){
	var GeneralRequirementsUrl = new Firebase("https://team-cinnamon.firebaseio.com/GeneralRequirements");
	var MajorRequirementsUrl = new Firebase("https://team-cinnamon.firebaseio.com/MajorRequirements");
	var ScheduleUrl = new Firebase('https://team-cinnamon.firebaseio.com/Schedule');

	var genReqsPromise = angularFire(GeneralRequirementsUrl, $scope, "genReqs");
	var majorReqsPromise = angularFire(MajorRequirementsUrl, $scope, "majorReqs");
	var schedulePromise = angularFire(ScheduleUrl, $scope, "user.schedule");
	
	genReqsPromise.then(function(){
		processCourseAvailable($scope.genReqs, Schedule);
	});
	majorReqsPromise.then(function(){
		processCourseAvailable($scope.majorReqs, Schedule);
	});

	// schedulePromise.then(function(){
	// 	console.log($scope.schedule);
	// })

	$scope.user = User;

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, course.sections.indexOf(section), Schedule.getCourses().length);
		// $scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeCoursePriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};

}]);

controllers.controller('ClassListController', ['$scope', '$routeParams',  'angularFire', 'User', 'Schedule', function($scope, $routeParams, angularFire, User, Schedule){
	if ($routeParams.searchQuery){
		$scope.searchQuery = $routeParams.searchQuery;
	};
	
	$scope.user = User;
	$scope.user.schedule = Schedule.getCourses();

	var AllClasses = new Firebase("https://team-cinnamon.firebaseio.com/AllClasses");
	var AllClassesPromise = angularFire(AllClasses, $scope, "classList");
	
	//Data preprocessing for classes
	AllClassesPromise.then(function(){
		processCourseAvailable($scope.classList, Schedule);
	});

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, course.sections.indexOf(section), Schedule.getCourses().length);
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

controllers.controller('CalendarController', ['$scope', 'Schedule', function($scope, Schedule){
	var sortService = new SortService();
	var axesDataService = new AxesDataService();
	var eventsDataService = new EventDataService();

	var calendarEvents = [];
	var dayStart = 9;
	var colors = ["#1abc9c", "#27ae60", "#2980b9", "#8e44ad", "#c0392b", "#f39c12"];
	var colorIndex = 0;
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

	function sectionsInCalendar(){
		return [{sections:[], dayCode:"M"}, 
		{sections:[], dayCode:"T"}, 
		{sections:[], dayCode:"W"}, 
		{sections:[], dayCode:"Th"}, 
		{sections:[], dayCode:"F"}]
	};

	$scope.sectionsInCalendar = new sectionsInCalendar();

	$scope.$watchCollection('user.schedule', function(scheduleElements){
		$scope.sectionsInCalendar = new sectionsInCalendar();
		angular.forEach(scheduleElements, function(scheduleElement){
			scheduleElement.course.color = scheduleElement.course.color ? scheduleElement.course.color : colors[colorIndex];
			colorIndex = (colorIndex + 1)%colors.length;
			angular.forEach(scheduleElement.course.sections, function(section){
				var sectionStartEndTimes = convertSectionTimeToMinutes(section)

				section.start = sectionStartEndTimes.start;
				section.end = sectionStartEndTimes.end;
				section.height = (section.end - section.start);
				section.color = scheduleElement.course.color;
				
				section.courseName = scheduleElement.course.className;
				section.selectedSection = (scheduleElement.section == section.sectionNumber) ? true : false;
				section.courseName = scheduleElement.course.className;

				if (section.meetingDays.indexOf("Monday") >= 0){
					$scope.sectionsInCalendar[0].sections.push(section)
				};
				if (section.meetingDays.indexOf("Tuesday") >= 0){
					$scope.sectionsInCalendar[1].sections.push(section)
				};
				if (section.meetingDays.indexOf("Wednesday") >= 0){
					$scope.sectionsInCalendar[2].sections.push(section)
				};
				if (section.meetingDays.indexOf("Thursday") >= 0){
					$scope.sectionsInCalendar[3].sections.push(section)
				};
				if (section.meetingDays.indexOf("Friday") >= 0){
					$scope.sectionsInCalendar[4].sections.push(section)
				};

			});
		});

		angular.forEach($scope.sectionsInCalendar, function(day){
			var sortedCourses = sortService.sortEventsByStartTime(day.sections);
			var processedData = eventsDataService.getEventsData(sortedCourses, Schedule);
		});
	});
	
	$scope.switchSection = function(section){
		// var course = section.course;
		// console.log(section)
		angular.forEach($scope.user.schedule, function(scheduleElement){
			if (scheduleElement.course.className == section.courseName){
				scheduleElement.section = section.sectionNumber;

				angular.forEach(scheduleElement.course.sections, function(courseSection){
					courseSection.selectedSection = (courseSection.selectedSection == section) ? true : false;
				});
			};
		});
		if (!section.selectedSection){
			section.selectedSection = true;
		};
	};

	$scope.styleSection = function(section){
		var height = section.height;
		var top = section.start * (2/3);
		var width = section.width * 60;
		var left = section.width * section.column * 60;
		color = section.color;
		if (section.selectedSection){
			return {'height': height, 'top': top, 
			'width': width, 
			'left': left,
			'background-color': color}
		}
		else {
			return { 'height': height, 'top': top, 
			'width': width, 
			'left': left,
			'border': '1px solid ' + color}
		};

	};
	
	var axesTimings = axesDataService.axesTimings(9, 18, 1);
	var axesData = axesDataService.getAxesData(axesTimings);

	$scope.axesData = axesData;

	$scope.computeHeight = function(courseSection){
		return (courseSection.end - courseSection.start)/60;
	};

}]);

controllers.controller('SearchController', ['$scope', '$location', function($scope, $location){
	$scope.searchModel = $scope.searchQuery ? $scope.searchQuery : "";
	$scope.searchForClasses = function(searchModel){
		$location.path('search/'+$scope.searchModel);
	};
}]);

controllers.controller('CourseSidebarController', ['$scope', '$filter', 'angularFire', 'Schedule', function($scope, $filter, angularFire, Schedule, ClassesStub){
	var AllClasses = new Firebase("https://team-cinnamon.firebaseio.com/AllClasses");
	var SidebarCoursesPromise = angularFire(AllClasses, $scope, "allCourses");
	SidebarCoursesPromise.then(function(){
		processCourseAvailable($scope.allCourses, Schedule);
	});

	$scope.sidebarAddModel = "";

	$scope.addCourseFromSidebar = function(course){
		if ($scope.sidebarAddModel){
			var courseToAdd = $filter('filter')($scope.allCourses, $scope.sidebarAddModel)[0];
			if (courseToAdd.available == "true" || courseToAdd.available == true){
				Schedule.addCourse(courseToAdd, 0, Schedule.getCourses().length);
				$scope.sidebarAddModel = "";
				}
			}
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.changeCoursePriority = function(index, direction){
		Schedule.swapCourses(index, direction);
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
		$scope.user.schedule = Schedule.getCourses();
	};
}]);
