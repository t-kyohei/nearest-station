// @ts-check

import

 {
 GeolocationSensor
} from './geolocation-sensor.js';


const geo = new GeolocationSensor({ frequency: 1 });
    geo.start();

    geo.onreading = () => console.log(`ˆÜ“x: ${geo.latitude}, Œo“x: ${geo.longitude},Žž: ${geo.timestamp}`);

    geo.onerror = event => console.error(event.error.name, event.error.message);