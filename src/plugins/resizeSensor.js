(function(){
    /* global ResizeSensor: false */
    /* global ElementQueries: false */
    'use strict';
    angular.module('gantt.resizeSensor', ['gantt']).directive('ganttResizeSensor', [function() {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.progress) === 'object') {
                    for (var option in scope.options.progress) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                function buildSensor() {
                    var ganttElement = element.parent().parent().parent()[0].querySelectorAll('div.gantt')[0];
                    return new ResizeSensor(ganttElement, function() {
                        ganttCtrl.gantt.$scope.ganttElementWidth = ganttElement.clientWidth;
                        ganttCtrl.gantt.$scope.$apply();
                    });
                }

                api.core.on.rendered(scope, function() {
                    if (sensor !== undefined) {
                        sensor.detach();
                    }
                    if (scope.enabled) {
                        ElementQueries.update();
                        sensor = buildSensor();
                    }
                });

                var sensor;
                scope.$watch('enabled', function(newValue) {
                    if (newValue && sensor === undefined) {
                        ElementQueries.update();
                        sensor = buildSensor();
                    } else if (!newValue && sensor !== undefined) {
                        sensor.detach();
                        sensor = undefined;
                    }
                });
            }
        };
    }]);
}());

