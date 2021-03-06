var controllers = angular.module('Controllers', []);
var colorIndex = 0;

function preprocessCourses(courses, Schedule){
	angular.forEach(courses, function(course){
		course.available = (course.available == 'true' || course.available == true) ? true : false;
		if (course.color == undefined){
			addColorToCourse(course, colorIndex);
			colorIndex = (colorIndex + 1)%6;
		};
	});
};

function addColorToCourse(course, colorIndex){
	var colors = ["#666DBA", "#828B90", "#3D8487", "#68BABD", "#688CD1", "#63A0C7"];
	course.color = colors[colorIndex];
}

controllers.controller('RequirementsController', ['$scope', 'angularFire', 'User', 'Schedule', function($scope, angularFire, User, Schedule){
	var GeneralRequirementsUrl = new Firebase("https://team-cinnamon.firebaseio.com/GeneralRequirements");
	var MajorRequirementsUrl = new Firebase("https://team-cinnamon.firebaseio.com/MajorRequirements");
	var ScheduleUrl = new Firebase('https://team-cinnamon.firebaseio.com/Schedule/' + User.getUsername());

	var genReqsPromise = angularFire(GeneralRequirementsUrl, $scope, "genReqs");
	var majorReqsPromise = angularFire(MajorRequirementsUrl, $scope, "majorReqs");
	var schedulePromise = angularFire(ScheduleUrl, $scope, "firebaseSchedule");

	genReqsPromise.then(function(){
		preprocessCourses($scope.genReqs, Schedule);
	});
	majorReqsPromise.then(function(){
		preprocessCourses($scope.majorReqs, Schedule);
	});

	$scope.user = User;
	$scope.user.name = User.getUsername();

	$scope.scheduleService = Schedule;


	schedulePromise.then(function(){
		Schedule.setCourses($scope.firebaseSchedule);
		$scope.user.schedule = Schedule.getCourses();
	});

	$scope.$watchCollection('firebaseSchedule', function(scheduleElements){
		Schedule.setCourses($scope.firebaseSchedule);
		$scope.user.schedule = Schedule.getCourses();
	});

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, course.sections.indexOf(section), Schedule.getCourses().length);
	};

	$scope.changeCoursePriority = function(index, direction){
		Schedule.swapCourses(index, direction)
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
	};

	$scope.courseInSchedule = function(course){
		if (Schedule.inSchedule(course)) {
			return true;
		}
		else {
			return false;
		};
	};
}]);

controllers.controller('ClassListController', ['$scope', '$routeParams',  'angularFire', 'User', 'Schedule', function($scope, $routeParams, angularFire, User, Schedule){
	if ($routeParams.searchQuery){
		$scope.searchQuery = $routeParams.searchQuery;
	};
	
	var AllClasses = new Firebase("https://team-cinnamon.firebaseio.com/AllClasses");
	var ScheduleUrl = new Firebase('https://team-cinnamon.firebaseio.com/Schedule/' + User.getUsername());

	var AllClassesPromise = angularFire(AllClasses, $scope, "classList");
	var schedulePromise = angularFire(ScheduleUrl, $scope, "firebaseSchedule");
	
	//Data preprocessing for classes
	AllClassesPromise.then(function(){
		preprocessCourses($scope.classList, Schedule);
	});

	$scope.user = User;
	$scope.scheduleService = Schedule;

	schedulePromise.then(function(){
		Schedule.setCourses($scope.firebaseSchedule);
		$scope.user.schedule = Schedule.getCourses();
	});

	$scope.$watchCollection('firebaseSchedule', function(scheduleElements){
		Schedule.setCourses($scope.firebaseSchedule);
		$scope.user.schedule = Schedule.getCourses();
	});

	$scope.addCourseToSchedule = function(course, section){
		Schedule.addCourse(course, course.sections.indexOf(section), Schedule.getCourses().length);
		$scope.user.schedule = Schedule.getCourses();
	};

	$scope.courseInSchedule = function(course){
		if (Schedule.inSchedule(course)){
			return true;
		}
		else {
			return false;
		};
	};

	$scope.sectionInSchedule = function(course){
		return Schedule.inSchedule(course, {getSectionInSchedule:true});
	}


	$scope.sectionAvailable = function(section){
		return section.available ? true : false;
	};

	$scope.switchSection = function(section, course){
		section.courseName = course.className;
		Schedule.switchSection(section);
	};

	$scope.removeCourseFromSchedule = function(course){
		Schedule.removeCourse(course);
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

	var yScale = $('.axes-time').height()/60;
	var xScale = $('.calendar-column').width();

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

	function conflictingCourses(day){
		var conflictingCoursesData = {dayCode:day.dayCode, conflictingCourseList:[]};
		angular.forEach(day.sections, function(section){
			if (section.width < 1){
				conflictingCoursesData.conflictingCourseList.push(section);
			};
		});
		return conflictingCoursesData;
	};

	function findCourseConflicts(day){
		if (conflictingCourses(day).conflictingCourseList.length > 0){
			$scope.conflictingCourses.coursesConflict = true;
			$scope.conflictingCourses.coursesInConflict.push(conflictingCourses(day));
		};
	}

	function sectionsInCalendar(){
		return [{sections:[], dayCode:"M"}, 
		{sections:[], dayCode:"T"}, 
		{sections:[], dayCode:"W"}, 
		{sections:[], dayCode:"Th"}, 
		{sections:[], dayCode:"F"}]
	};

	function placeInCalendarDay(section){
		if (section.meetingDays.indexOf("Monday") >= 0){
			$scope.sectionsInCalendar[0].sections.push($.extend({}, section));
		};
		if (section.meetingDays.indexOf("Tuesday") >= 0){
			$scope.sectionsInCalendar[1].sections.push($.extend({}, section));
		};
		if (section.meetingDays.indexOf("Wednesday") >= 0){
			$scope.sectionsInCalendar[2].sections.push($.extend({}, section));
		};
		if (section.meetingDays.indexOf("Thursday") >= 0){
			$scope.sectionsInCalendar[3].sections.push($.extend({}, section));
		};
		if (section.meetingDays.indexOf("Friday") >= 0){
			$scope.sectionsInCalendar[4].sections.push($.extend({}, section));
		};
	};

	$scope.sectionsInCalendar = new sectionsInCalendar();

	$scope.$watchCollection('user.schedule', function(scheduleElements){
		$scope.sectionsInCalendar = new sectionsInCalendar();
		$scope.conflictingCourses = {coursesConflict:false, coursesInConflict:[]};

		angular.forEach(scheduleElements, function(scheduleElement){
			angular.forEach(scheduleElement.course.sections, function(section){
				var sectionStartEndTimes = convertSectionTimeToMinutes(section)

				section.start = sectionStartEndTimes.start;
				section.end = sectionStartEndTimes.end;
				section.height = (section.end - section.start);
				section.color = scheduleElement.course.color;
				
				section.courseName = scheduleElement.course.className;
				section.selectedSection = (scheduleElement.section == section.sectionNumber) ? true : false;
				section.courseName = scheduleElement.course.className;

				placeInCalendarDay(section);
			});
		});
		
		angular.forEach($scope.sectionsInCalendar, function(day){
			var sortedCourses = sortService.sortEventsByStartTime(day.sections);
			var processedData = eventsDataService.getEventsData(sortedCourses);
			findCourseConflicts(day);
		});
	});
	
	$scope.switchSection = function(section){
		Schedule.switchSection(section);
	};

	$scope.styleSection = function(section){
		var height = section.height * yScale;
		var top = section.start * yScale;

		var width = section.width * xScale;
		var left = section.width * section.column * xScale;
		color = section.color;

		if (section.selectedSection){
			return {'height': height, 'top': top, 
			'width': width, 
			'color': '#ecf0f1',
			'font-weight': 100,
			'left': left,
			'background-color': color}
		}
		else {
			return { 'height': height, 'top': top, 
			'width': width, 
			'left': left,
			'border': '1px solid ' + color,
			'color': '#34495e',
			'font-weight': 600
			}
		};

	};
	
	var axesTimings = axesDataService.axesTimings(9, 18, 1);
	var axesData = axesDataService.getAxesData(axesTimings);

	$scope.axesData = axesData;

	$scope.computeHeight = function(courseSection){
		return (courseSection.end - courseSection.start)/60;
	};

	$scope.strToInt = function(str){
		return parseInt(str, 10);
	}

}]);

controllers.controller('SearchController', ['$scope', '$location', function($scope, $location){
	$scope.searchModel = $scope.searchQuery ? $scope.searchQuery : "";
	$scope.searchForClasses = function(searchModel){
		$location.path('search/'+$scope.searchModel);
	};
}]);

controllers.controller('CourseSidebarController', ['$scope', '$filter', '$element', '$timeout', '$routeParams', 'angularFire', 'Schedule', 'TestService', function($scope, $filter, $element, $timeout, $routeParams, angularFire, Schedule, TestService){
	var AllClasses = new Firebase("https://team-cinnamon.firebaseio.com/AllClasses");
	var SidebarCoursesPromise = angularFire(AllClasses, $scope, "allCourses");

	SidebarCoursesPromise.then(function(){
		preprocessCourses($scope.allCourses, Schedule);
	});

	$scope.sidebarAddModel = "";
	$scope.submitted = false;

	$scope.testId = TestService.getTestId();
	$scope.scheduleService = Schedule;

	window.setTestId = function(testId){
		TestService.setTestId(testId);
		$scope.testId = TestService.getTestId();
		$scope.$apply();
	}

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
	};

	$scope.stylePanel = function(course){
		return {
			'background-color':course.course.color
		}
	}

	$scope.submitToRegistrar = function(){
		$scope.submitted = true;
	}
}]);

controllers.controller('AdminController', ['$scope', '$log', 'angularFire' ,'AdminService', function($scope, $log, angularFire, AdminService){
	var allClassesRef = new Firebase("https://team-cinnamon.firebaseio.com/AllClasses");
	var genReqsRef = new Firebase("https://team-cinnamon.firebaseio.com/GeneralRequirements");
	var majorReqsRef = new Firebase("https://team-cinnamon.firebaseio.com/MajorRequirements");
	
	var allClassesPromise = angularFire(allClassesRef, $scope, 'allCourses');
	angularFire(genReqsRef, $scope, 'genReqs');
	angularFire(majorReqsRef, $scope, 'majorReqs');

	allClassesPromise.then(function(){
		$scope.courseCollection = $scope.allCourses;
		$scope.collectionId = "allCourses";
	})

	var newCourseModel = {
	"className": "",
	"description":"",
	"prerequisites":[],
	"professor":"",
	"available":"true",
	"sections": []
	};

	$scope.newCourse = {
	"className": "",
	"description":"",
	"prerequisites":[""],
	"professor":"",
	"available":true,
	"sections": [{
		"meetingDays":[""],
		"startTime":"",
		"endTime":"",
		"sectionNumber":"",
		"studentsRegistered":"",
		"spotsInClass":""
		}]
	};

	$scope.sectionModel = [{sectionAttribute: "meetingDays", data:""},
		{sectionAttribute: "startTime", data:""},
		{sectionAttribute: "endTime", data:""},
		{sectionAttribute: "sectionNumber", data:""},
		{sectionAttribute: "studentsRegistered", data:""},
		{sectionAttribute: "spotsInClass", data:""}];

	function updateCourseCollection(){
		if ($scope.collectionId == 'allCourses'){
			$scope.allCourses = $scope.courseCollection;
		}
	};

	$scope.addSection = function(course){
		var section={}
		if (!course.sections){
			course.sections = [];
		}
		angular.forEach($scope.sectionModel, function(attribute){
			section[attribute.sectionAttribute] = attribute.data
			if (attribute.sectionAttribute == "sectionNumber"){
				section[attribute.sectionAttribute] = course.sections.length;
			};
		});
		course.sections.push(section);
		$scope.updateCourseCollection();
	};

	$scope.deleteCourse = function(course){
		angular.forEach($scope.courseCollection, function(courseInCollection, index){
			if (courseInCollection === course){
				$scope.courseCollection.splice(index, 1)
			};
		});

		$scope.updateCourseCollection();
	};

	$scope.deleteSection = function(course, section){
		angular.forEach(course.sections, function(sectionInCourse, index){
			if (sectionInCourse === section){
				course.sections.splice(index, 1);
			};
		});
	};

	$scope.addCourse = function(){
		$scope.courseCollection.unshift($scope.newCourse);

		if ($scope.collectionId == 'allCourses'){
			$scope.allCourses = $scope.courseCollection;
		}

		$scope.newCourse = {
			"className": "",
			"description":"",
			"prerequisites":[],
			"professor":"",
			"available":"true",
			"sections": []
			};
	}

	$scope.availible = function(course){
		if (course.availible != undefined){
			if (course.availible == true || course.availible == "true"){
				return "true"
			};
			return "false"
		}
	}

	$scope.typeof = function(object){
		return typeof(object)
	};

	$scope.updateCourseCollection = function(){
		if ($scope.collectionId == 'allCourses'){
			$scope.allCourses = $scope.courseCollection;
		}
		if ($scope.collectionId == 'majorReqs'){
			$scope.majorReqs = $scope.courseCollection;
		}
		if ($scope.collectionId == 'genReqs'){
			$scope.genReqs = $scope.courseCollection;
		}
	}

	$scope.switchDB = function(db){
		if (db == 'allClasses'){
			$scope.courseCollection = $scope.allCourses;
			$scope.collectionId = 'allCourses';
		}

		if (db == 'majorReqs'){
			$scope.courseCollection = $scope.majorReqs;
			$scope.collectionId = 'majorReqs';
		}

		if (db == 'generalReqs'){
			$scope.courseCollection = $scope.genReqs;
			$scope.collectionId = 'genReqs';
		}
	}
}]);

controllers.controller('LoginController', ['$scope', '$location', '$routeParams', 'Schedule', 'User', 'TestService', function($scope, $location, $routeParams, Schedule, User, TestService){
	$scope.login = function(){
		User.setUsername($scope.username);
		$location.path('/requirements');
	};
	if ($routeParams.testId){
		TestService.setTestId($routeParams.testId);
	};
}]);

controllers.controller('TopNavigationController', ['$scope', '$location', function($scope, $location){
 	
 }]);

controllers.controller('ABTestController', ['$scope', 'TestService', function($scope, TestService){
	$scope.testId = TestService.getTestId();
	$scope.changeTestId = function(){
		TestService.setTestId($scope.testId);
	}
}]);
