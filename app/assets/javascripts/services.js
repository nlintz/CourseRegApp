var services = angular.module('Services', []);

services.factory('ClassesStub', ['$http', function($http){
	return $http.get('/jsonData/classesStub.json');
}]);

services.service('Schedule', [function(){
	this.courses = [];
	this.addCourse = function(course, section, priority){
		this.courses.push({course:course, section:section, priority:priority});
		this.sortCourses();
	};

	this.sortCourses = function(){
		this.courses = _.sortBy(this.courses, function(course){return course.priority});
	}

	this.getCourses = function(){
		return this.courses;
	};

	this.reprioritizeCourses = function(){
		//When the courses array changes, you need to reassign priorities 
		//otherwise, there will be gaps e.g. 0, 2
		angular.forEach(this.courses, function(course, index){
			course.priority = index;
		});
	};

	this.removeCourse = function(course){
		var index = this.courses.indexOf(course);
		this.courses.splice(index, 1);
		this.reprioritizeCourses();
	};

	this.swapCourses = function(index, direction){
		if (direction == 'up'){
			if (index > 0){
				var courseToMoveUp = this.courses[index];
				var courseToMoveDown = this.courses[index-1];
				var tempPriority = courseToMoveDown.priority;
				courseToMoveDown.priority = courseToMoveUp.priority;
				courseToMoveUp.priority = tempPriority;
			};
		};

		if (direction == 'down'){
			if (index < (this.courses.length - 1)){
				var courseToMoveUp = this.courses[index+1];
				var courseToMoveDown = this.courses[index];
				var tempPriority = courseToMoveDown.priority;
				courseToMoveDown.priority = courseToMoveUp.priority;
				courseToMoveUp.priority = tempPriority;
			};
		};
		this.sortCourses();
	};

}]);

services.service('User', [function(){
	this.name = "Tyler";
	this.major = "E:XYZ";
	this.yog = 15;
	this.takenClasses = [];
}]);