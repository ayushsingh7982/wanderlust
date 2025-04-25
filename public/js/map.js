// map.js
function geocodeAddress(address, mapApiKey) {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${mapApiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                return coordinates; // [longitude, latitude]
            } else {
                console.error("Address not found");
                return null;
            }
        })
        .catch(error => {
            console.error("Error fetching geocoding data:", error);
            return null;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const address = document.getElementById('listing-location').dataset.location;
    const mapApiKey = document.getElementById('listing-location').dataset.apikey;

    geocodeAddress(address, mapApiKey).then(coordinates => {
        if (coordinates) {
            // Initialize map with the fetched coordinates
            var map = new maplibregl.Map({
                container: 'map',
                style: 'https://api.maptiler.com/maps/streets/style.json?key=' + mapApiKey, // MapTiler Style
                center: coordinates,  // Set the center to the geocoded coordinates
                zoom: 12
            });

            // Add navigation controls (zoom and rotate)
            map.addControl(new maplibregl.NavigationControl());

            // Add a marker at the geocoded location
            new maplibregl.Marker({ color: "red" })
                .setLngLat(coordinates) // Place the marker at the coordinates
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML("<p>Exact location provided after booking</p>")
                )
                .addTo(map);

        }
    });
});

