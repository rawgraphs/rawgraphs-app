'use strict';

angular.module('mgcrea.ngStrap.helpers.dateFormatter', [])

  .service('$dateFormatter', function ($locale, dateFilter) {

    // The unused `lang` arguments are on purpose. The default implementation does not
    // use them and it always uses the locale loaded into the `$locale` service.
    // Custom implementations might use it, thus allowing different directives to
    // have different languages.

    this.getDefaultLocale = function () {
      return $locale.id;
    };

    // Format is either a data format name, e.g. "shortTime" or "fullDate", or a date format
    // Return either the corresponding date format or the given date format.
    this.getDatetimeFormat = function (format, lang) {
      return $locale.DATETIME_FORMATS[format] || format;
    };

    this.weekdaysShort = function (lang) {
      return $locale.DATETIME_FORMATS.SHORTDAY;
    };

    function splitTimeFormat (format) {
      return /(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(format).slice(1);
    }

    // h:mm a => h
    this.hoursFormat = function (timeFormat) {
      return splitTimeFormat(timeFormat)[0];
    };

    // h:mm a => mm
    this.minutesFormat = function (timeFormat) {
      return splitTimeFormat(timeFormat)[2];
    };

    // h:mm:ss a => ss
    this.secondsFormat = function (timeFormat) {
      return splitTimeFormat(timeFormat)[4];
    };

    // h:mm a => :
    this.timeSeparator = function (timeFormat) {
      return splitTimeFormat(timeFormat)[1];
    };

    // h:mm:ss a => true, h:mm a => false
    this.showSeconds = function (timeFormat) {
      return !!splitTimeFormat(timeFormat)[4];
    };

    // h:mm a => true, H.mm => false
    this.showAM = function (timeFormat) {
      return !!splitTimeFormat(timeFormat)[5];
    };

    this.formatDate = function (date, format, lang, timezone) {
      return dateFilter(date, format, timezone);
    };

  });
