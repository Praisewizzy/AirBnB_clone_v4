
cument').ready(function () {
  const amenities = {};
  $('INPUT[type="checkbox"]').change(function () {
    if ($(this).prop('checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities H4').text(Object.values(amenities).join(', '));
  });

// toggle class on div#api_status
  const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  $.get(url, (body, status) => {
    if (status === 'OK') {
      $('div#api_status').addClass('available')
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
