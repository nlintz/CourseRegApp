CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers', 'Services', 'Directives']);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/requirements.html', controller: 'RequirementsController'})
	$routeProvider.when('/courseList/:courseId', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController'} )
	$routeProvider.otherwise('/')
]);