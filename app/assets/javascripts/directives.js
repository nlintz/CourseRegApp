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
            elem.affix({
                offset: { top: elem.offset().top }
            });
        }
    }
});

directives.directive('swappable', function(){
    return {
        restrict: 'A',
        scope: {
            course: '=course'
        },
        link: function(scope, elem, attr){
            // $scope.$apply();
        }
    }
})