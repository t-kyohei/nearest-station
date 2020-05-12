// @ts-check

import

 {
 GeolocationSensor
} from './geolocation-sensor.js';


const geo = new GeolocationSensor({ frequency: 1 });
    geo.start();

    geo.onreading = () => console.log(`�ܓx: ${geo.latitude}, �o�x: ${geo.longitude},����: ${geo.timestamp}`);

    geo.onerror = event => console.error(event.error.name, event.error.message);