    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 13 // starting zoom
    });


    const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(`<h6>${title}</h6>
            <p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);
   