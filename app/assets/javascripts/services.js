var services = angular.module('Services', []);

services.factory('ClassesStub', ['$http', function($http){
	return $http.get('/jsonData/classesStub.json');
}]);

services.service('Schedule', [function(){
	this.courses = [];
	this.addCourse = function(course, section, priority){
		this.courses.push({course:course, section:section, priority:priority});
	};

	this.getCourses = function(){
		return this.courses;
	};

	this.removeCourse = function($index){
		this.courses.splice($index, 1);
	};
}]);

services.service('User', [function(){
	this.name = "Tyler";
	this.major = "E:XYZ";
	this.yog = 15;
	this.takenClasses = [];
}]);