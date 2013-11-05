CourseRegistrationApp = angular.module('CourseRegistrationApp', ['Controllers', 'Services', 'Directives']);

CourseRegistrationApp.config(['$routeProvider', ($routeProvider) ->
	$routeProvider.when('/', {templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}})
	$routeProvider.when('/courseList', { templateUrl: '/views/courseList.html', controller: 'ClassListController', resolve: {ClassesStub: 'ClassesStub'} } );
	$routeProvider.when('/requirements', { templateUrl: '/views/requirements.html', controller: 'RequirementsController', resolve: {ClassesStub: 'ClassesStub'}} )
	$routeProvider.otherwise('/')
]);