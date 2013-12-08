var filters = angular.module('Filters', []);

filters.filter('ArrayToString', function(){
	return function(input) {
		return input.join(", ");
	};
});

filters.filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
});

filters.filter('twentyFourHour', function(){
    return function(time){
        var hour = parseInt(time.split(':')[0], 10);
        var minutes = time.split(':')[1];
        if (hour > 12){
            return String(hour-12) + ':' + minutes
        }
        else {
            return time
        }
    }
});

filters.filter('parseSectionNumber', function(){
    return function(sectionNumber){
        return parseInt(sectionNumber, 10) + 1;
    }
});

filters.filter('dayFromDayCode', function(){
    return function(dayCode){
        if (dayCode == 'M'){return 'Monday '}
        if (dayCode == 'T'){return 'Tuesday '}
        if (dayCode == 'W'){return 'Wednesday '}
        if (dayCode == 'Th'){return 'Thursday '}
        if (dayCode == 'F'){return 'Friday '}
    }
})