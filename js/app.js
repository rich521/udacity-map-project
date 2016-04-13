var places = [
  {
    name: 'London Bridge',
    position: {lat: 51.508245, lng: -0.087700},
    info: "<b>Quick Fact:</b> the bridge is locacted between the city of London and Southwark"
  },{
    name: 'London Eye',
    position: {lat: 51.502820, lng: -0.119252},
    info: "<b>Quick Fact:</b> its height is 135 meters"
  },{
    name: 'St Paul\'s Cathedral',
    position: {lat: 51.514274, lng: -0.098992},
    info: "<b>Quick Fact:</b> construction started in 1675, opened in 1708"
  },{
    name: 'Big Ben',
    position: {lat: 51.499840, lng: -0.124663},
    info: "<b>Quick Fact:</b> It is of Gothic Revival architecture"
  },{
    name: 'Buckingham Palace',
    position: {lat: 51.501009, lng: -0.141588},
    info: "<b>Quick Fact:</b> Floor space is around 77,000 m²!"
  },{
    name: 'Somerset House',
    position: {lat: 51.510732, lng: -0.116938},
    info: "<b>Quick Fact:</b> It's a major arts and cultural centre in the heart of London"
  },{
    name: 'Kensington Palace',
    position: {lat: 51.504894, lng: -0.188130},
    info: "<b>Quick Fact:</b> Kensington Palace is a royal residence set in Kensington Gardens, in the Royal Borough of Kensington and Chelsea in London, England"
  }
];

var Markers = function(){

};

var ViewModel = function(){

};


/*---------GOOGLE MAP------------*/

var map,
    markers = [];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(51.508245, -0.087700),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < places.length; i++) {

        var newMarker = new google.maps.Marker({
            position: new google.maps.LatLng(places[i].position),
            map: map,
            title: places[i].name,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(newMarker, 'click', (function (newMarker, i) {
            return function () {
                infowindow.setContent(places[i].name);
                infowindow.open(map, newMarker);
            }
        })(newMarker, i));

        markers.push(newMarker);
    }
}






