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
        		// console.log(className)
        		return className.split(" ").join("");
        	};
      	}
	};
});

directives.directive('affixed', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
                // var marginTop = $('div.calendar').css('margin-top').substring(0,2);
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
        link: function(scope, elem, attr){
            // console.log()
        }
    }
})

directives.directive('activeNav', ['$location', function($location){
    return {
        restrict: 'A',
        link: function(scope, elem, attr){
            var path = $location.path().split('/')[1];
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
                scope.daysWithConflicts = [];
                angular.forEach(scope.conflictingCourses.coursesInConflict, function(course){
                    scope.daysWithConflicts.push(course.dayCode);
                })
            })
        }    
    }
}]);