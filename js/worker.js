// @ts-check

import

 {
 GeolocationSensor
} from './geolocation-sensor.js';


const geo = new GeolocationSensor({ frequency: 1 });
    geo.start();

    geo.onreading = () => console.log(`緯度: ${geo.latitude}, 経度: ${geo.longitude},時刻: ${geo.timestamp}`);

    geo.onerror = event => console.error(event.error.name, event.error.message);