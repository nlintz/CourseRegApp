CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers']);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/requirements.html', controller: 'RequirementsController'})
	$routeProvider.when('/courseList/:courseId', { templateUrl: '/views/courseList.html'} )
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController'} )
	$routeProvider.otherwise('/')
]);