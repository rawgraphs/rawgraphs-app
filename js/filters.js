'use strict';

/* Filters */

angular.module('raw.filters', [])

	.filter('categoryFilter', [function () {
	    return function (charts, category) {
            return charts.filter(function (chart){
            	return !chart.category() && category == 'Others' || chart.category() == category;
            });
	    };
	}])

	.filter('decodeUrl', [function () {
	    return function (url) {
				if (!url) return url;
        return decodeURIComponent(url);
	    };
	}])
