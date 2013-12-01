CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers', 'Services', 'Directives', 'Filters', 'ui.keypress', 'firebase', 'ngCookies']);

CourseRegistrationApp.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
	# $routeProvider.when('/', {templateUrl: '/views/login.html', controller: 'LoginController'});
	$routeProvider.when('/login', {templateUrl: '/views/login.html', controller: 'LoginController'});
	$routeProvider.when('/courseList', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search/:searchQuery', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}} );

	$routeProvider.when('/courseList/:test', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search/:searchQuery/:test', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search/:test', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements/:test', { templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}} );

	$routeProvider.when('/admin', { templateUrl: 'views/admin.html', controller:'AdminController'});
	$routeProvider.otherwise({ redirectTo: '/login'});
]);