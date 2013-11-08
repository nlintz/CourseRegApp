var services = angular.module('Services', []);

services.factory('ClassesStub', ['$http', function($http){
	return $http.get('/jsonData/classesStub.json');
}]);

services.factory('FirebaseSchedule', ['$http', function($http){
	return $http({url: 'https://team-cinnamon.firebaseio.com/Schedule.json'});
}]);

services.service('Schedule', [function(){
	this.scheduleRef = new Firebase('https://team-cinnamon.firebaseio.com/Schedule');
	this.courses = [];

	this.setCourses = function(courses){
		var schedule = [];
		angular.forEach(courses, function(course){
			schedule.push({course: JSON.parse(course.course), section: parseInt(course.section, 10), priority: parseInt(course.section, 10)});
		});
		this.courses = schedule;
	}

	this.getCourses = function(courses){
		return this.courses;
	}

	this.inSchedule = function(course){
		for (var i=0; i<this.courses.length; i++){
			if (this.courses[i].course.className == course.className){
				return true;
			};
		};
		return false
	};

	this.addCourse = function(course, section, priority){
		if (this.inSchedule(course) == false){
			var scheduleElement = {course:course, section:String(section), priority:String(priority)};
			var scheduleElementForFirebase = {course:JSON.stringify(course), section:String(section), priority:String(priority)};
			scheduleElement.course.inSchedule = true;
			this.scheduleRef.push(scheduleElementForFirebase)
			this.sortCourses();
		};
	};

	this.sortCourses = function(){
		this.courses = _.sortBy(this.courses, function(course){return course.priority});
	}

	this.reprioritizeCourses = function(){
		//When the courses array changes, you need to reassign priorities 
		//otherwise, there will be gaps e.g. 0, 2
		angular.forEach(this.courses, function(course, index){
			course.priority = index;
		});
	};

	this.removeCourse = function(course){
		var indexToRemove = -1;
		course.inSchedule = false;
		angular.forEach(this.courses, function(courseInSchedule, index){
			if (courseInSchedule.course == course){
				indexToRemove = index;
			};
		});
		this.courses.splice(indexToRemove, 1);
		this.reprioritizeCourses();
		this.scheduleRef.set(this.formatCoursesForFirebase(this.courses));
	};

	this.formatCoursesForFirebase = function(courses){
		var formattedCourses = [];
		angular.forEach(courses, function(course){
			formattedCourses.push({course:JSON.stringify(course.course), section:String(course.section), priority:String(course.priority)});
		});
		return formattedCourses;
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