jQuery(function($) {

  // Debug flag
  var debugMode = true;

  // Default time delay before checking location
  var callBackTime = 100;

  // # px before tracking a reader
  var readerLocation = 150;

  // Set some flags for tracking & execution
  var timer = 0;
  var scroller = false;
  var endOpeningTimes = false;
  var endPatientsSay = false;
  var endSurgeryGPs = false;
  var endServices = false;
  var endParking = false;
  var didComplete = false;

  // Set some time variables to calculate reading time
  var startTime = new Date();
  var beginning = startTime.getTime();
  var totalTime = 0;

  // Get some information about the current page
  var pageTitle = document.title;

  function scrolledSection(start, section) {
    currentTime = new Date();
    if (start) {
      scrollStart = currentTime.getTime();
      timeToScroll = Math.round((scrollStart - beginning) / 1000);
      if (!debugMode) {
          ga('send', 'event', section, timeToScroll+'s');
      } else {
          alert(section + ' (Time: ' + timeToScroll + 's)');
      }

    } else {
      scrollEnd = currentTime.getTime();
      timeToScroll = Math.round((scrollEnd - scrollStart) / 1000);
      if (!debugMode) {
          ga('send', 'event', 'User reached the "' + section +'" section', timeToScroll+'s');
      } else {
          alert('User reached the "' + section + '" section (Time: ' + timeToScroll + 's)');
      }
    }
    scroller = true;
  }

  // Check the location and track user
  function trackLocation() {
      bottom = $(window).height() + $(window).scrollTop();
      height = $(document).height();
      results = $('.reading-width .sr-only').attr('data-results');
      results_14 = Math.round(results / 4);
      results_12 = Math.round(results / 2);
      results_34 = Math.round(results_14 * 3);


      // If user starts to scroll send an event
      if (bottom > readerLocation && !scroller) {
        scrolledSection(true, 'User started scrolling');
        scroller = true;
      }

      if ($('h2.opening-times:contains("GP")').length && bottom > $('h2.opening-times:contains("GP")').offset().top + $('h2.opening-times:contains("GP")').outerHeight() && !endOpeningTimes) {
        scrolledSection(false, 'GP Opening Times');
        endOpeningTimes = true;
      }

      if ($('h2:contains("What patients say about this surgery")').length && bottom > $('h2:contains("What patients say about this surgery")').offset().top + $('h2:contains("What patients say about this surgery")').outerHeight() && !endPatientsSay) {
        scrolledSection(false, 'What patients say about this surgery');
        endPatientsSay = true;
      }

      if ($('h2:contains("GPs at this surgery")').length && bottom > $('h2:contains("GPs at this surgery")').offset().top + $('h2:contains("GPs at this surgery")').outerHeight() && !endSurgeryGPs) {
        scrolledSection(false, 'GPs at this surgery');
        endSurgeryGPs = true;
      }

      if ($('h2:contains("Services at this surgery")').length && bottom > $('h2:contains("Services at this surgery")').offset().top + $('h2:contains("Services at this surgery")').outerHeight() && !endServices) {
        scrolledSection(false, 'Services at this surgery');
        endServices = true;
      }

      if ($('h2:contains("Parking")').length && bottom > $('h2:contains("Parking")').offset().top + $('h2:contains("Parking")').outerHeight() && !endParking) {
        scrolledSection(false, 'Parking and accessibility');
        endParking = true;
      }

      if (bottom > $('footer ul.link-list').offset().top + $('footer ul.link-list').outerHeight() && !didComplete) {
        scrolledSection(false, 'end of the page');
        didComplete = true;
      }
  }

  // Track the scrolling and track location
  $(window).scroll(function() {
      if (timer) {
          clearTimeout(timer);
      }

      // Use a buffer so we don't call trackLocation too often.
      timer = setTimeout(trackLocation, callBackTime);
  });

});
