import Leaflet from 'leaflet';

import mapMarkerImg from '../assets/icons/map-marker.svg';

const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,
  
    iconSize: [28, 48],
    iconAnchor: [15, 48],
    popupAnchor: [0, -60]
  })

export default mapIcon;