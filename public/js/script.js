const socket = io();

if(navigator.geolocation){
    console.log('Geolocation is supported');
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('send-Location', {latitude, longitude});
    }, (error) => {
        console.error(error);
        console.log('Please allow location access to use this feature');
    }, {
        enableHighAccuracy: true, // true means the device will try to get the most accurate location possible
        timeout: 5000, // 5 seconds timeout for the location request to be completed before an error is thrown
        maximumAge: 0, // 0 means no cache use which means always get the current location
    });
}

const map = L.map('map').setView([0, 0], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://github.com/vasusrivastav">Vasu GitHub</a> contributors'
}).addTo(map);

const markers = {};

socket.on('receive-Location', (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16); // set the view of the map to the location of the sender
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        console.log('user added', markers[id]);
    }
});

socket.on('user-disconnected', (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]); // remove the marker of the disconnected user from the map 
        delete markers[id]; // remove the marker of the disconnected user from the map
    }    
}); // remove the marker of the disconnected user from the map


