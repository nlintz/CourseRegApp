var directives = angular.module('Directives', []);

directives.directive('learnMoreModal', function(){
	return {
		restrict: 'A',

		scope: {
			course: '=course'
		},

		templateUrl: "/partials/moreInfoModal.html",

		link: function (scope, elem, attrs) {
        	elem.bind('click', function(){
        		$('#moreInfoModal').modal('toggle');
        	});
      	}
	};
});