/*global beforeEach, afterEach, describe, it, inject, expect, module, spyOn, fullcalendar, angular, $*/
describe('uiCalendar', function () {
    'use strict';

    var scope, $compile;

    beforeEach(module('ui'));
    beforeEach(inject(function (_$rootScope_, _$compile_) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;

        
          //Date Objects needed for event
          var date = new Date();
          var d = date.getDate();
          var m = date.getMonth();
          var y = date.getFullYear();

          // create an array of events, to pass into the directive. 
          scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1),url: 'http://www.angularjs.org'},
            {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: true}];

          // create an array of events, to pass into the directive. 
          scope.events2 = [
            {title: 'All Day Event 2',start: new Date(y, m, 1),url: 'http://www.atlantacarlocksmith.com'},
            {title: 'Long Event 2',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 998,title: 'Repeating Event 2',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 998,title: 'Repeating Event 2',start: new Date(y, m, d + 4, 16, 0),allDay: true}];
          //array to test equalsTracker with
          scope.events3 = [
            {title: 'All Day Event 3',start: new Date(y, m, 1),url: 'http://www.atlantacarlocksmith.com'},
            {title: 'Long Event 3',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
            {id: 998,title: 'Repeating Event 3',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 998,title: 'Repeating Event 3',start: new Date(y, m, d + 4, 16, 0),allDay: true}];

          // create an array of events, to pass into the directive. 
          scope.events4 = [{title: 'All Day Event 3',start: new Date(y, m, 1),url: 'http://www.yoyoyo.com'}];

          //equalsTracker to force the calendar to update on rare occasions
          //ie... an event source is replacing another and has the same length as the prior eventSource
          //or... replacing an eventSource that is an object with another eventSource
          scope.equalsTracker = 0;

          //event Sources array  
          scope.eventSources = [scope.events,scope.events2]; //End of Events Array
          
          scope.addSource = function(source) {
            scope.eventSources.push(source);
          };

          scope.addChild = function(array) {
            array.push({
              title: 'Click for Google ' + scope.events.length,
              start: new Date(y, m, 28),
              end: new Date(y, m, 29),
              url: 'http://google.com/'
            });
          };

          scope.remove = function(array,index) {
            array.splice(index,1);
          };

          scope.uiConfig = {
            calendar:{
              height: 200,
              weekends: false,
              defaultView: 'month'
           }
          };
         
    }));

    afterEach(function() {
      angular.module('ui.config').value('ui.config', {}); // cleanup
    });

    describe('compiling this directive and checking for events inside the calendar', function () {


        /* test the calendar's events length  */
        it('should excpect to load 4 events to scope', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toBe(4);
        });
        /* test to check the title of the first event. */
        it('should excpect to be All Day Event', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][0].title).toBe('All Day Event');
        });
        /* test to make sure the event has a url assigned to it. */
        it('should expect the url to = http://www.angularjs.org', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][0].url).toBe('http://www.angularjs.org');
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[1][0].url).toBe('http://www.atlantacarlocksmith.com');
        });
        /* test the 3rd events' allDay field. */
        it('should expect the fourth Events all Day field to equal true', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0][3].allDay).toNotBe(false);
        });
        /* Tests the height of the calendar. */
        it('should expect the calendar attribute height to be 200', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].height).toEqual(200);  
        });
        /* Tests the weekends boolean of the calendar. */
        it('should expect the calendar attribute weekends to be false', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].weekends).toEqual(false);
        });
        /* Test to make sure that when an event is added to the calendar everything is updated with the new event. */
        it('should expect the scopes events to increase by 2', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toEqual(4);
            scope.addChild(scope.events);
            scope.addChild(scope.events);
            expect($.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length).toEqual(6);
        });
        /* Test to make sure the calendar is updating itself on changes to events length. */
        it('should expect the calendar to update itself with new events', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(4);
            //remove an event from the scope.
            scope.remove(scope.events,0);
            //events should auto update inside the calendar. 
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
        });
        /* Test to make sure header options can be overwritten */
        it('should overwrite default header options', function () {
            spyOn($.fn, 'fullCalendar');
            scope.uiConfig2 = {
              calendar:{
                header: {center: 'title'} 
             }
            };
            $compile('<div ui-calendar="uiConfig2.calendar" ng-model="eventSources"></div>')(scope);
            expect($.fn.fullCalendar.mostRecentCall.args[0].hasOwnProperty('header')).toEqual(true);
            var header = $.fn.fullCalendar.mostRecentCall.args[0].header;
            expect(header).toEqual({center: 'title'});
        });
        /* Test to see if calendar is watching all eventSources for changes. */
        it('should update the calendar if any eventSource array contains a delta', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            var clientEventsLength2 = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[1].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventsLength2).toEqual(4);
            //remove an event from the scope.
            scope.remove(scope.events2,0);
            //events should auto update inside the calendar. 
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            clientEventsLength2 = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[1].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventsLength2).toEqual(3);
            scope.remove(scope.events,0);
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
        });
        /* Test to see if calendar is updating when a new eventSource is added. */
        it('should update the calendar if an eventSource is Added', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources"></div>')(scope);
            var clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources.length;
            expect(clientEventSources).toEqual(2);
            //add new source to calendar
            scope.addSource(scope.events4);
            //eventSources should auto update inside the calendar. 
            clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources.length;
            expect(clientEventSources).toEqual(3);
            //go ahead and add some more events to the array and check those too.
            scope.addChild(scope.events4);
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[2].length;
            expect(clientEventsLength).toEqual(2);
        });
        /* Test to see if calendar is updating when an eventSource replaces another with an equal length. */
        it('should update the calendar if an eventSource has same length as prior eventSource', function () {
            spyOn($.fn, 'fullCalendar');
            $compile('<div ui-calendar="uiConfig.calendar" ng-model="eventSources" equals-tracker="equalsTracker"></div>')(scope);
            var clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            var clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(4);
            expect(clientEventSources.length).toEqual(2);
            expect(clientEventSources[1][0].title).toEqual('All Day Event 2');
            //replace source with one that has the same length
            scope.eventSources.splice(1,1,scope.events3);
            //must update the equalsTracker as we would detect that the length is equal from controller
            scope.equalsTracker++;
            //eventSources should update inside the calendar since we incremented the equalsTracker 
            clientEventSources = $.fn.fullCalendar.mostRecentCall.args[0].eventSources;
            expect(clientEventSources.length).toEqual(2);
            expect(clientEventSources[1][0].title).toEqual('All Day Event 3');
            //remove an event to prove autobinding still works
            scope.remove(scope.events,0);
            clientEventsLength = $.fn.fullCalendar.mostRecentCall.args[0].eventSources[0].length;
            expect(clientEventsLength).toEqual(3);
           
        });

       });

});
