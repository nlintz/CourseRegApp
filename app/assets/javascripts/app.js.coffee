CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers', 'Services', 'Directives', 'ui.keypress']);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}})
	$routeProvider.when('/courseList', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/search/:searchQuery', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}} )
	$routeProvider.otherwise('/')
]);