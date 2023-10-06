
cument').ready(function () {
  const domain = 'http://' + window.location.hostname;

  const amenities = {};
  $('INPUT[type="checkbox"]').change(function () {
    if ($(this).prop('checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities H4').text(Object.values(amenities).join(', '));
  });

  // Filter places by Amenity
  $('.filters button').click(() => {
    $.ajax({
      url: domain + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({ 'amenities': Object.keys(amenities) }),
      contentType: 'application/json',
      dataType: 'json',
      success: appendToPlaces
    });
  });

// check api status (toggle class on div#api_status)
  $.get(domain + ':5001/api/v1/status/', (body, status) => {
    if (status === 'OK') {
      $('div#api_status').addClass('available')
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  // Fetch places
  $.ajax({
    url: domain + ':5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: appendToPlaces
  });
});
   
// appends places from place search to section.places
function appendToPlaces (data) {
  $('SECTION.places').empty();
  data.forEach((place) => {
    $('SECTION.places').append(
            `<article>
              <div class="title_box">
			          <h2>${place.name}</h2>
			          <div class="price_by_night">$${place.price_by_night}</div>
			        </div>
              <div class="information">
                <div class="max_guest">
                  ${place.max_guest} Guest${place.max_guest !== 1 ? "s" : ""}
                </div>
                <div class="number_rooms">${place.number_rooms} Bedroom${
                  place.number_rooms !== 1 ? "s" : ""}
                </div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						      place.number_bathrooms !== 1 ? "s" : ""}
                </div>
              </div>

              <div class="description">${place.description}</div>
            </article>`
        )
      });
    }
 
