//Defining the collection of places
var places = ko.observableArray([
  {
    name: 'London Bridge',
    position: {lat: 51.508245, lng: -0.087700},
  },{
    name: 'London Eye',
    position: {lat: 51.502820, lng: -0.119252},
  },{
    name: 'St Paul\'s Cathedral',
    position: {lat: 51.514274, lng: -0.098992},
  },{
    name: 'Big Ben',
    position: {lat: 51.499840, lng: -0.124663},
  },{
    name: 'Buckingham Palace',
    position: {lat: 51.501009, lng: -0.141588},
  },{
    name: 'Somerset House',
    position: {lat: 51.510732, lng: -0.116938},
  },{
    name: 'Kensington Palace',
    position: {lat: 51.504894, lng: -0.188130},
  }
]);

//Redefine places() into variable
function ViewModel(){
    var self = this, 
        location = places();
    // Text from search field
    self.filterText = ko.observable(""); 
    for (var i = 0; i < location.length; i++) {
        location[i]["search_content"] = ">";
        for (var x in location[i] ) {
            if ( !location[i].hasOwnProperty(x) || x == "search_content" || typeof location[i][x] !== "string") {continue;}
            location[i]["search_content"] += location[i][x].toUpperCase();
        }
    }
    // Collection of places after going through search filter
    self.filteredPlaces = ko.computed(function () {
        var regExp;
        // If many white spaces in a row, replace with only one white space. (g modifier & case insensitive)
        fText = self.filterText().replace(/\s+/gi, '|');
        fText = fText.replace(/\|\s*$/gi, '');
        //Define a new regular expression
        regExp = new RegExp(fText, "gi");
        // If there is anything in the search box, filter for this
        // As of now this does not divide the filterText and only searches the Name field
        var filteredCollection = ko.utils.arrayFilter(places(), function(test) {
            if(fText.length)
                return test.search_content.match(regExp);
            else
                return 1;
        });
        return filteredCollection;
    }, self);  
}

//Run KO!
var runDoc = function(){
    var vm = new ViewModel();
    ko.applyBindings(vm);
};
runDoc();


/*---------GOOGLE MAP------------*/

var map, 
    markers = [];
function initMap() {
    var location = places();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(51.508245, -0.087700),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < location.length; i++) {
        setTimeout(function(i) {
          var newMarker = new google.maps.Marker({
              position: new google.maps.LatLng(location[i].position),
              map: map,
              title: location[i].name,
              animation: google.maps.Animation.DROP
          });

          google.maps.event.addListener(newMarker, 'click', (function (newMarker, i) {
              return function () {
                  infowindow.setContent(location[i].name);
                  infowindow.open(map, newMarker);
                  //Bounce the marker
                  newMarker.setAnimation(google.maps.Animation.BOUNCE);
                  //Then set a timer to stop the marker bouncing after 750ms (1 bounce)
                  setTimeout(function(){newMarker.setAnimation(null);}, 750)
              }
          })(newMarker, i));

          markers.push(newMarker);
        //200ms interval for each marker created
        }, i * 200, i);
    }
}