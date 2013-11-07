var filters = angular.module('Filters', []);

filters.filter('ArrayToString', function(){
	return function(input) {
		return input.join(", ");
	};
});