// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var leads = [];
google.maps.event.addDomListener(window, 'load', function () {
  var places = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
  google.maps.event.addListener(places, 'place_changed', function () {
      var place = places.getPlace();
      var address = place.formatted_address;
      var rating = place.rating;
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var mesg = "Address: " + address;
      mesg += "\nLatitude: " + latitude;
      mesg += "\nLongitude: " + longitude;
      var radius = document.getElementById("radius").value;
      document.getElementById("latitude").value = latitude;
      document.getElementById("longitude").value = longitude;
      document.getElementById("totals").value = 0;
      initMap(input.value, radius)

  });
});



$(document).on("keypress", "input", function(e){
  if(e.which == 13){
    var radius = document.getElementById("radius").value;
    document.getElementById("totals").value = 0;
    initMap(input.value, radius)
  }
});


$(document).ready(function(){
  $("#radius").on("input", function(){
    if ($(this).val().length >= 4) {
      document.getElementById("totals").value = 0;
      initMap(input.value, $(this).val())
    }
    
  });
});

function initMap(keyword, radius) {
  document.getElementById("places").innerHTML = "";
  // Create the map.
  var latitude = document.getElementById("latitude").value;
  var longitude = document.getElementById("longitude").value;
  alert("Processing Data")
  const pyrmont = { lat: Number(latitude), lng: Number(longitude) };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 17,
    mapId: "8d193001f940fde3",
  });
  // Create the places service.
  const service = new google.maps.places.PlacesService(map);
  let getNextPage;
  const moreButton = document.getElementById("more");

  moreButton.onclick = function () {
    moreButton.disabled = true;
    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search.z
  service.nearbySearch(
    { location: pyrmont, radius: radius, keyword: keyword },
    (results, status, pagination) => {
      if (status !== "OK" || !results) return;

      addPlaces(results, map, service);
      moreButton.disabled = !pagination || !pagination.hasNextPage;
      if (pagination && pagination.hasNextPage) {
        getNextPage = () => {
          // Note: nextPage will call the same handler function as the initial call
          pagination.nextPage();
        };
      }
    }
  );
}

function addPlaces(places, map, service) {
  const placesList = document.getElementById("places");
  var lead;
  var number_loop = 0;
  var nomor = document.getElementById("totals").value;
  for (const place of places) {
    
    console.log(nomor);
    document.getElementById("total").innerHTML = nomor;
    document.getElementById("totals").value = nomor;
    nomor++;
    //console.log();
    setTimeout(
      function(){
        //Loope
        service.getDetails(
          {placeId: place.place_id},
          function(results, status) {
            console.log(status);
            var phone_number = "-";
            if (results) {
              
              if (results.international_phone_number) {
                var phone_number = results.international_phone_number;
              }else {
                var phone_number = "Empty";
              }
              lead = {phone:phone_number, name:place.name, address:results.formatted_address,rating:results.rating};
              if (place.geometry && place.geometry.location) {
                const image = {
                  url: place.icon,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25),
                };

                
          
                var marker = new google.maps.Marker({
                  map,
                  icon: image,
                  title: place.name,
                  position: place.geometry.location,
                });
                marker.setPosition(place.geometry.location);
                marker.setTitle(place.name);
          
                const li = document.createElement("li");
                li.textContent = place.name +"   "+ phone_number;
    
                placesList.appendChild(li);
                li.addEventListener("click", () => {
                  map.setCenter(place.geometry.location);
                });
              }
              //Slash
            }
          }
        );
        //Loope
      }
  , 500 * number_loop);
  number_loop++;

  }
  

}


window.initMap = initMap;