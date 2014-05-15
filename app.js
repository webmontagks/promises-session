jQuery(function ($) {
  "use strict";

  // Load images asynchronously
  function preloadImage(src) {
    var deferred = new $.Deferred();
    var img = new Image();
    img.onerror = deferred.reject;
    img.onload = function () {
      img.onload = function () {};
      setTimeout(function () {
        deferred.resolve(img);
      }, Math.random() * 2000)
    }
    img.src = src;
    return deferred.promise();
  };

  // where the magic happens
  $('#start').click(function () {
    var $time = $('#time').empty();
    var $percent = $('#percent').empty();
    var $footer = $('footer').empty();
    var start = new Date();
    // var status = new $.Deferred();
    $('#gallery > .row').empty();

    $.getJSON('images.php').then(function (images) {
      var promises = [];
      var sum = images.length;
      var counter = 0;
      for (var i in images) {
        (function () {
          var promise = preloadImage(images[i]);
          var $container = $('<div class="col-xs-4"><a href="#" class="thumbnail"></a></div>')
                           .appendTo('#gallery > .row');
          var spinner = new Spinner();
          promise.done(function (img) {
            $(img).hide().appendTo($container.find('.thumbnail')).fadeIn('slow');
            spinner.stop();
          });
          // promise.always(function () {
          //   status.notify(++counter, sum);
          // });
          spinner.spin($container[0]);
          promises.push(promise);
        }());
      }

      $.when.apply($, promises).then(function () {
        var images = Array.prototype.slice.call(arguments);
      }, function () {
        // on Error
        debugger;
      })
      // .always(function () {
      //   status.resolve();
      // });
    });


    // status.progress(function (count, sum) {
    //   $percent.val(Math.round((count / sum) * 100, 0) + '%');
    // });
    // status.done(function () {
    //   var stop = new Date();
    //   $footer.text("All Done in " + (stop - start) + ' ms');
    // });
  });
});