
cument').ready(function () {
  const domain = 'http://' + window.location.hostname;

  const amenities = {};
  const states = {};
  const cities = {};

  $('INPUT[type="checkbox"]').change(function () {
    const dataType = $(this).attr('data-type');
    let dataOptions = {
      states: states,
      cities: cities,
      amenities: amenities
    };

    const data = dataOptions[dataType];

    if ($(this).prop('checked')) {
      data[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete data[$(this).attr('data-id')];
    }

    if (dataType === 'amenities') {
      $('.amenities H4').text(Object.values(amenities).join(', '));
    } else {
       const locations = Object.assign({}, states, cities);
       if (Object.values(locations).length === 0) {
         $('.locations H4').html('&nbsp;');
        } else {
          $('.locations H4').text(Object.values(locations).join(', '));
        }
    }
  });

  // Filter places by Amenity
  $('.filters button').click(() => {
    $.ajax({
      url: domain + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        'amenities': Object.keys(amenities),
        'cities': Object.keys(cities),
        'amenities': Object.keys(amenities)
        }),
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
              <div class="reviews"">
                <h2> <span data-id="${place.id}">show</span></h2>
                <ul></ul>
              </div>
            </article>`
        )
      });
      
      $('.reviews span').click(function () {
        const placeId = $(this).attr('data-id');
        const reviewsContainer = $(this).closest('.reviews').find('ul');
        const domain = 'http://' + window.location.hostname;

        // if the button text is "show", fetch and display the reviews
          if ($(this).text() === 'show') {
            $.get(`${domain}:5001/api/v1/places/${placeId}/reviews`, function(data) {
              // clear the current reviews
              reviewsContainer.empty();

              // add each review as a list item
              data.forEach(function (review) {
                const li = $('<li>').text(review.text);
                reviewsContainer.append(li);
              });

              // change the button text to "hide"
              $(this).text('hide');
            }.bind(this));
          } else {
            // if the button text is "hide", remove all reviews from the DOM
            reviewsContainer.empty();

            // change the button text to "show"
            $(this).text('show');

          }
      });
    }
 
