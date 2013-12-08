var directives = angular.module('Directives', []);

directives.directive('learnMoreModal', function(){
	return {
		restrict: 'A',

		scope: {
			modalCourse: '=modalCourse',
			schedule: '=schedule',
		},

		templateUrl: "/partials/moreInfoModal.html",

		link: function (scope, elem, attrs) {
        	scope.open = function(){
        		$('#' + scope.formatId(scope.modalCourse.className)).modal('toggle');
        	}

        	scope.close = function(){
        		$('#' + scope.formatId(scope.modalCourse.className)).modal('toggle');
        	};

        	scope.addCourseToSchedule = function(course, section){
				scope.schedule.addCourse(course, course.sections.indexOf(section), scope.schedule.courses.length);
        	};

            scope.strToInt = function(str){
                return parseInt(str, 10);
            }

        	scope.formatId = function(className){
        		return className.split(" ").join("");
        	};
      	}
	};
});

directives.directive('myCoursesModal', function() {
    return {
        restrict: 'A',
    
        scope: {
            schedule: "=schedule"
        },
    
        templateUrl: "/partials/myCoursesModal.html",
    
        link: function(scope, elem, attrs){
            scope.toggle = function(){
                scope.nextSemesterSchedule = scope.schedule.slice(0, 4);
                $("#my-courses-modal").modal('toggle');
            };
        }
    };
});

directives.directive('affixed', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
                var marginTop = 0;
                elem.affix({
                    offset: { top: elem.offset().top - marginTop }
                });
            }
    }
});

directives.directive('swappable', function(){
    return {
        restrict: 'A',
        replace: 'false',
        link: function(scope, elem, attr){
        }
    }
})

directives.directive('activeNav', ['$location', function($location){
    return {
        restrict: 'A',
        link: function(scope, elem, attr){
            var path = $location.path().split('/')[1];
            if (path == 'search'){
                path = 'courseList';
            }
            if (path == attr.id){
                elem.addClass('active');
            }
        }
    }
}]);

directives.directive('courseConflictHeader', [function(){
    return {
        restrict: 'E',
        scope: {
            conflictingCourses: "=conflictingCourses"
        },
        templateUrl: 'partials/courseConflictHeader.html',
        link: function(scope, elem, attr){
            scope.$watch('conflictingCourses', function(){
                var daysWithConflicts = [];
                // var daysWithConflicts = _.map(scope.conflictingCourses.coursesInConflict, function(day){return day.dayCode});
                var coursesInConflict = scope.conflictingCourses.coursesInConflict;
                angular.forEach(coursesInConflict, function(day){
                    var conflictCount = _.reduce(day.conflictingCourseList, function(memo, section){
                        if (section.selectedSection == true){
                            return memo + 1;
                        }
                        else {
                            return memo;
                        }
                    }, 0)
                    if (conflictCount > 1){
                        daysWithConflicts.push(day.dayCode);
                    };
                });
                scope.daysWithConflicts = daysWithConflicts;
            });
            scope.areConflicts = function(daysWithConflicts){
                if (daysWithConflicts == undefined) return
                if(daysWithConflicts.length > 0){
                    return true;
                }
                else {
                    return false;
                }
            }
        }    
    }
}]);