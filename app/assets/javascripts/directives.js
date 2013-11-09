var directives = angular.module('Directives', []);

directives.directive('learnMoreModal', function(){
	return {
		restrict: 'A',

		scope: {
			course: '=course',
			schedule: '=schedule'
		},

		templateUrl: "/partials/moreInfoModal.html",

		link: function (scope, elem, attrs) {

        	scope.open = function(){
        		$('#moreInfoModal').modal('toggle');
        	}

        	scope.close = function(){
        		$('#moreInfoModal').modal('toggle');
        	};

        	scope.addCourseToSchedule = function(course, section){
				scope.schedule.addCourse(course, course.sections.indexOf(section), scope.schedule.getCourses().length);
        	};
      	}
	};
});