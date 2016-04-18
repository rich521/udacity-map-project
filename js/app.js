//Hard coded data for marker pin example.
var initialPlaces = [
  {
    name: 'Big Ben',
    position: {lat: 51.499840, lng: -0.124663},
  },{
    name: 'Buckingham Palace',
    position: {lat: 51.501009, lng: -0.141588}
  },{
    name: 'Kensington Palace',
    position: {lat: 51.504894, lng: -0.188130}
  },{
    name: 'Madame Tussauds London',
    position: {lat: 51.522965, lng: -0.155051}
  },{
    name: 'London Bridge',
    position: {lat: 51.508245, lng: -0.087700}
  },{
    name: 'London Eye',
    position: {lat: 51.502820, lng: -0.119252}
  },{
    name: 'Royal Opera House',
    position: {lat: 51.513283, lng: -0.123433}
  },{
    name: 'Sadler\'s Wells Theatre',
    position: {lat: 51.529409, lng: -0.106248}
  },{
    name: 'Somerset House',
    position: {lat: 51.510732, lng: -0.116938}
  },{
    name: 'St Paul\'s Cathedral',
    position: {lat: 51.514274, lng: -0.098992}
  },{
    name: 'The British Library',
    position: {lat: 51.529985, lng: -0.127014}
  },{
    name: 'Tower of London',
    position: {lat: 51.508112, lng: -0.075949}
  }
];
/*------------GOOGLE MAP------------*/
var map,
    markers = [],
    infowindow,
    state = false,
    iconBase = "img/marker.svg";

var initMap = function() {
    var LatLong = new google.maps.LatLng(51.50500, -0.134663);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: LatLong,
        disableDefaultUI: true
    });
    //Disable the extra poi's on google
    var mapPoi = [{
        featureType: "poi",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "transit",
        stylers: [{
            visibility: "off"
        }]
    }];

    map.setOptions({
        styles: mapPoi
    });

    infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < initialPlaces.length; i++) {
        showPin(i);
    }

    function showPin(i) {
        setTimeout(function() {
            var newMarker = new google.maps.Marker({
                position: new google.maps.LatLng(initialPlaces[i].position),
                map: map,
                title: initialPlaces[i].name,
                animation: google.maps.Animation.DROP,
                icon: iconBase
            });
            google.maps.event.addListener(newMarker, 'click', (function(newMarker, i) {
                return function() {
                    //flickrData(initialPlaces[i].name);
                    openWindow(newMarker, initialPlaces[i].name);
                };
            })(newMarker, i));
            markers.push(newMarker);
            //120ms interval for each marker created
        }, i * 0, i);
        //when markers are pushed into array
        if (i === initialPlaces.length - 1) {
            state = true;
        }
    }
    //Recenter the map when resizing to Latlong 
    google.maps.event.addDomListenerOnce(map, 'idle', function() {
        google.maps.event.addDomListener(window, 'resize', function() {
            map.setCenter(LatLong);
        });
    });
};

//InfoWindow function
var openWindow = function(data, places) {
    var url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=' + places + '&tagmode=any&format=json&jsoncallback=?';
    var imgData;
    var link;

    //No error handling available, therefore we set 'setTimeout' if it runs too long
    var flickrRequestTimeout = setTimeout(function() {
        infowindow.setContent('<div id="infoWindow"><h4>' + places + '</h4>' + '<h6>Failed to load Flickr image</h6></div>');
    }, 4000); //4 seconds

    $.ajax({
        url: url,
        dataType: 'jsonp',
        // jsonp: "callback",  --> by default. if needed to be changed
        success: function(response) {
            link = response.items[0].media.m;
            imgData = '<div><img src="' + link + '" alt="Image Source" /></div>';
            flickr();
            clearTimeout(flickrRequestTimeout);
        }
    });

    infoWindow();

    function infoWindow() {
        infowindow.setContent('<div id="infoWindow"><h4>' + places + '</h4>' + '<div id="loading"></div></div>');
        infowindow.open(map, data);
        //Bounce the marker
        data.setAnimation(google.maps.Animation.BOUNCE);
        //Then set a timer to stop the marker bouncing after 750ms (1 bounce)
        setTimeout(function() {
            data.setAnimation(null);
        }, 750);
    }

    function flickr() {
        infowindow.setContent('<div id="infoWindow"><h4>' + places + '</h4>' + imgData + '<a href="' + link + '" target="_blank">source: \'Flickr images\'</p></div>');
    }
};

//Filter the markers when called
var filterMarker = function(listed) {
    for (var i = 0; i < listed.length; i++) {
        for (var j = 0; j < markers.length; j++) {
            if (markers[j].title === listed[i].name) {
                markers[j].setVisible(true);
            }
        }
    }
};

/*------------KnockoutJS------------*/
var Place = function(data) {
    this.name = ko.observable(data.name);
};

//Redefine initialPlaces() into variable
var ViewModel = function() {
    var self = this,
        places = ko.observableArray(initialPlaces),
        location = places(),
        nameArray = [];

    //Create an observableArray, each with new Place object
    this.placeList = ko.observableArray([]);
    initialPlaces.forEach(function(placeItem) {
        self.placeList.push(new Place(placeItem));
        nameArray.push(placeItem.name);
    });

    //store our place to a new current place variable
    this.currentPlace = ko.observable(this.placeList()[0]);

    //click to set the selected place
    this.clickPlace = function(clickedPlace) {
        self.currentPlace(clickedPlace);
        openWindow(markers[nameArray.indexOf(clickedPlace.name)], clickedPlace.name);
    };

    // Text from search field
    self.filterText = ko.observable("");
    for (var i = 0; i < location.length; i++) {
        var content = "search_content",
            loc = location[i];
        loc.content = ">";
        for (var x in loc) {
            if (loc.hasOwnProperty(x) || x !== content || typeof loc[x] === "string") {
                loc.content += loc[x];
            }
        }
    }
    // Collection of initialPlaces after going through search filter
    self.filteredPlaces = ko.computed(function() {
        var regExp, fText;
        fText = self.filterText();
        //Define a new regular expression
        regExp = new RegExp(fText, "gi");
        // If there is anything in the search box, filter for this
        var filteredCollection = ko.utils.arrayFilter(location, function(text) {
            if (fText.length)
                return text.content.match(regExp);
            else
                return true;
        });
        //Remove all markers first, then show visibile ones matching the search field
        if (state) {
            for (var z = 0; z < markers.length; z++) {
                infowindow.close();
                markers[z].setVisible(false);
            }
            filterMarker(filteredCollection);
        }
        return filteredCollection;
    }, self);

};

var nav = true;
function openNav() {
    if (nav) {
        document.getElementById("mySidenav").style.width = "275px";
        document.getElementById("nav-button").style.marginLeft = "275px";
        nav = false;
    } else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("nav-button").style.marginLeft = "0";
        nav = true;
    }
}
//Run the app
ko.applyBindings(new ViewModel());