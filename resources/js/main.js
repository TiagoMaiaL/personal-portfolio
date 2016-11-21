(function() {
  $(document).ready(function() {

    /**
     * Initializing masonry grid.
     */
    $('.masonry').masonry({
      itemSelector: '.masonry-item',
      columnWidth: '.masonry-sizer',
      percentPosition: true
    });

    /**
     * Handler for clicks on the project divs.
     */
    $('.project').click(function(event) {
      if ($(window).width >= 900)
        return;

      var hasClass = $(this).hasClass('active');

      $('.project').removeClass('active');
      $(this).toggleClass('active', !hasClass);
    });

  });
})()

