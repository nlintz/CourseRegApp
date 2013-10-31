CourseRegistrationApp = angular.module('CourseRegistrationApp', []);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/requirements.html'})
	$routeProvider.when('/courseList/:courseId', { templateUrl: '/views/courseList.html'} )
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html'} )
	$routeProvider.otherwise('/')
]);