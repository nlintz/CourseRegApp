CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers', 'Services', 'Directives', 'Filters', 'ui.keypress', 'firebase']);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/login.html', controller: 'LoginController'})
	$routeProvider.when('/courseList', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search/:searchQuery', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}} )
	$routeProvider.when('/admin', { templateUrl: 'views/admin.html', controller:'AdminController'})
	$routeProvider.otherwise('/')
]);