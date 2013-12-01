/**
 * DataService.js
 * Nathan Lintz
 * Script Used For Parsing Time Arrays
 */

/*		Helper Methods		*/
var SortService = function(){
	this.sortEventsByStartTime = function(events){
		var sortedTimes = _.sortBy(events, function(time){ return time.start; });
		return sortedTimes;
	};
	this.sortEventsByColumn = function(events){
		var sortedColumns = _.sortBy(events, function(event){ return event.column; });
		return sortedColumns;
	};
};

/*		Axes Data Processing		*/
function AxesDataService(){
	this.axesTimings = function(startTime, endTime, interval){
		var times = [];
		for (var i=0; i<=(endTime - startTime)/interval; i++){
			times.push(startTime + interval*i);
		}
		return times;
	};

	this.getAxesData = function(axesTimings){
		var that = this; // Trick to bind 'this' to the correct contenxt
		var timings = [];
		$.each(axesTimings, function(index, time){
			var AMPM = (time < 12) ? 'AM' : 'PM';
			timings.push({'AMPM': AMPM, 'fractionalMinutes': (time - Math.floor(time)), 'time': that.convertTimeToMinutes(time)});
		});
		return timings;
	};

	this.convertTimeToMinutes = function(time){
		var hour = Math.floor(time) > 12 ? Math.floor(time) - 12 : Math.floor(time);
		var fractionalMinutes = time - Math.floor(time);
		if (fractionalMinutes == 0){
			return String(hour) + ":00";
		}
		else{
			return String(hour) + ":" + String(fractionalMinutes * 60);
		}
	};
};

/*		Events Data Processing		*/
function EventDataService(){
	this.sortService = new SortService();
	this.modelValidationService = new ModelValidationService();

	// Gives each event a column
	this.assignColumns = function(event, collidingEvents){
		event.column = this.findMinUnplacedColumn(collidingEvents);
		return event;
	};

	// Gives each event a width
	this.assignWidths =function(event, collidingEvents){
		var events = collidingEvents.concat(event);
		event.width = (event.width != undefined) ? Math.min(1.0/events.length, event.width) : 1.0/events.length;
		for (var i=0; i<collidingEvents.length; i++){
			collidingEvents[i].width = Math.min(1.0/events.length, collidingEvents[i].width);
		};
		return events;
	};

	// Gives each event a title and a location
	this.assignText = function(events){
		var minHeightForTitle = 22; //Only show the title if the box is 22 pixels high, otherwise text overflows into next event
		var minHeightForLocation = 34; //Same thing except for the location
		$.each(events, function(index, event){
			event.title = "";
			event.location = "";
			var height = (event.end - event.start);

			if (height > 22){
				event.title = "Sample Item";
			};

			if (height > 34){
				event.location = "Sample Location";
			};
		});
	};

	// Compares two events to see if there is a collision
	this.compareEventCollision = function(eventA, eventB){
		if (eventA.end > eventB.start){
			return true;
		};
	};

	// Takes an event and sees if it collides with any ecent already been placed
	this.findCollisions = function(event, placedEvents){
		var collidingEvents = [];
		for (var i=0; i<placedEvents.length; i++){
			if (this.compareEventCollision(placedEvents[i], event)){
				collidingEvents.push(placedEvents[i]);
			};
		};
		// console.log(collidingEvents);
		return collidingEvents;
	};

	// When placing an event, find the first column that it can fit in without overlapping
	// with another event
	this.findMinUnplacedColumn = function(events){
		var minUnplacedColumn = 0;
		var eventsSortedByColumns = this.sortService.sortEventsByColumn(events);
		for (var i=0; i<events.length; i++){
			if (eventsSortedByColumns[i].column == minUnplacedColumn){
				minUnplacedColumn += 1;
			};
		};
		return minUnplacedColumn;
	};

	// Method which processes and validates the events
	this.getEventsData = function(events){
		// var validatedEvents = this.validateEvents(events);
		var placedEvents = this.placeEvents(events);
		return placedEvents;
	};

	// places events with the correct columns and widths
	// TODO: Improve runtime of algorithm
	this.placeEvents = function(events){
		var placedEvents = [];
		var unplacedEvents = this.sortService.sortEventsByStartTime(events);
		for (var i=0; i<events.length; i++){
			var event = events[i];
			var collidingEvents = this.findCollisions(event, placedEvents);
			this.assignColumns(event, collidingEvents);
			this.assignWidths(event, collidingEvents);
			placedEvents.push(event);
		};
		// this.assignText(placedEvents);
		return placedEvents;
	};

	this.validateEvents = function(events){
		var CALENDAR_END_TIME = 720; //Last time in caldendar is 9PM which is 720 minutes past 9 AM
		var validatedEvents = this.modelValidationService.getValidatedEvents(events, CALENDAR_END_TIME);
		return validatedEvents;
	};
};


/*		Handles validation for events 		*/
function ModelValidationService(){
	this.getValidatedEvents = function(events, calendarEndTime){
		var that = this;
		that.validateInputIsArray(events);
		$.each(events, function(index, event){
			that.validateStartsBeforeCalendarEnd(event, calendarEndTime);
			that.validateEndsBeforeCalendarEnd(event, calendarEndTime)
			that.validateStartsBeforeCalendarEnd(event, calendarEndTime);
			that.validateEndAfterStart(event);
			that.validateHasStartAndEnd(event);
		});
		return events;
	};

	// Validate that the end time of each event is after the start time
	this.validateEndAfterStart = function(event){
		if(event.start >= event.end){
			throw "Event end times must be after the start time";
		};
	};

	// Validate that event ends before the last time of the calendar.
	// If event ends after 9PM, truncate the event to the last time of the calendar
	this.validateEndsBeforeCalendarEnd = function(event, calendarEndTime){
		if (event.end > calendarEndTime){
			event.end = calendarEndTime;
		};
	};

	// Validates that events don't start before the end time of the calendar
	this.validateStartsBeforeCalendarEnd = function(event, calendarEndTime){
		if (event.start > calendarEndTime){
			throw "Event start times must be before the last time displayed on the calendar"
		};
	};

	// Validate that event has a start and an end time
	this.validateHasStartAndEnd = function(event){
		if(event.start === undefined){
			throw "Event must have a start time";
		};
		if(event.end === undefined){
			throw "Event must have an end time";
		};
	};

	// Validates that input is an array
	this.validateInputIsArray = function(events){
		if (!Array.isArray(events)){
			throw "Events for layOutDay must be in an array";
		};
	};
};
