function stores() {
  if (localStorage.getItem("stores")) return;
  var stores = [
    {
      name: "Test1",
      lat: 40.6313817,
      lng: 22.9522129
    },
    {
      name: "Test2",
      lat: 40.6642728,
      lng: 22.9066067
    }
  ];

  localStorage.setItem("stores", JSON.stringify(stores));
}
stores();
var map;
function initMap() {
  var card = document.getElementById("pac-card");
  var input = document.getElementById("pac-input");

  var lst = JSON.parse(localStorage.getItem("stores"));
  var store = new google.maps.LatLng(lst[0]["lat"], lst[0]["lng"]);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: store,
    zoom: 12
  });

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener("place_changed", function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          ""
      ].join(" ");
    }

    infowindowContent.children["place-icon"].src = place.icon;
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = address;
    infowindow.open(map, marker);

    console.log(marker.getPosition().lat());
    var markerPos = new google.maps.LatLng(
      marker.getPosition().lat(),
      marker.getPosition().lng()
    );
    if (!check_is_in_or_out(storeCircle, markerPos))
      alert(
        "Δεν υπάρχουν διαθέσιμα καταστήματα για την διεύθυνση " +
          infowindowContent.children["place-address"].textContent
      );
  });

  createRadius();
}
var storeCircle = new Array();
function createRadius() {
  clearMarkers();
  var lst = JSON.parse(localStorage.getItem("stores"));
  for (var currentStore in lst) {
    var temp = new google.maps.LatLng(
      lst[currentStore]["lat"],
      lst[currentStore]["lng"]
    );
    storeCircle.push(
      new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: temp,
        radius: 2000
      })
    );
  }
}
function clearMarkers() {
  for (var currentStore in storeCircle) {
    storeCircle[currentStore].setMap(null);
  }
}

function check_is_in_or_out(storeCircle, marker) {
  console.log(storeCircle);
  var contain = false;
  for (var currentStore in storeCircle) {
    if (storeCircle[currentStore].getBounds().contains(marker)) contain = true;
  }
  return contain;
}

function addStore() {
  var $ = jQuery;
  var st = JSON.parse(localStorage.getItem("stores"));
  console.log(st);
  var name = $("#store-name");
  var lat = $("#lat");
  var lng = $("#lng");
  var currentStore = {
    name: name.val(),
    lat: parseFloat(lat.val()),
    lng: parseFloat(lng.val())
  };
  st.push(currentStore);
  console.log(st);
  localStorage.setItem("stores", JSON.stringify(st));
  createRadius();
  name.val("");
  lat.val("");
  lng.val("");
}

function hidePanel() {
  jQuery(".add-new").on("click", function() {
    if (jQuery(".stores").is(":visible")) jQuery(".stores").hide();
    else jQuery(".stores").show();
  });
}
hidePanel();
