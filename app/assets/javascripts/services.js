var services = angular.module('Services', []);

services.factory('ClassesStub', ['$http', function($http){
	return $http.get('/jsonData/classesStub.json');
}]);

services.factory('Schedule', [function(){
	var schedule = [];
	return {
		getSchedule: function() {return this.schedule},
		addClassToSchedule: function(course, section) {
			schedule.push({course: course, section:section});
		}
	};
}]);