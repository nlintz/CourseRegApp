var services = angular.module('Services', []);

services.factory('ClassesStub', ['$http', function($http){
	return $http.get('/jsonData/classesStub.json');
}]);