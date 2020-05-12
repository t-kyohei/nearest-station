// @ts-check
import

 {
 GeolocationSensor
} from './geolocation-sensor.js';

  //let acl = new Accelerometer({frequency: 30});
  //let sensorM = new Magnetometer();
  //let sensorg = new Gyroscope();
  //let geo = new GeolocationSensor({frequency: 30});
 
  //let sensor = new Sensor();
  /*
  GeolocationSensor.read()
  .then(geo => console.log(`緯度: ${geo.latitude}, 経度: ${geo.longitude}`))
  .catch(error => console.error(error.name));
  */
  /*
navigator.permissions.query({ name: 'accelerometer' }).then(result => {
    if (result.state === 'denied') {
        console.log('加速度計センサを利用する許可は否認されました。');
        return;
    }

    let acl = new Accelerometer({frequency: 30});
    let max_magnitude = 0;
    acl.addEventListener('activate', () => console.log('測定する用意ができました'));
    acl.addEventListener('error', error => console.log(`エラー： ${error.name}`));
    acl.addEventListener('reading', () => {
        let magnitude = Math.hypot(acl.x, acl.y, acl.z);
        if (magnitude > max_magnitude) {
            max_magnitude = magnitude;
            console.log(`最大値： ${max_magnitude} m/s2`);
            alert(max_magnitude);
        }
    });
    acl.start();
*/
//});
/*
GeolocationSensor.read()
  .then(geo => console.log(`緯度: ${geo.latitude}, 経度: ${geo.longitude}`))
  .catch(error => console.error(error.name));
*/
navigator.permissions.query({ name: 'geolocation' }).then(result => {
    if (result.state === 'denied') {
        console.log('加速度計センサを利用する許可は否認されました。');
        return;
    }
   // alert("テスト前");
    const geo = new GeolocationSensor({ frequency: 1 });
    geo.start();

    geo.onreading = () => console.log(`緯度: ${geo.latitude}, 経度: ${geo.longitude},時刻: ${geo.timestamp}`);

    geo.onerror = event => console.error(event.error.name, event.error.message);
    //alert("テスト");
});


var dbName = 'sampleDB';
var dbVersion = '2';
var storeName  = 'location';
var count = 0;
//　DB名を指定して接続
var openReq  = indexedDB.open(dbName, dbVersion);
// 接続に失敗
openReq.onerror = function (event) {
    console.log('接続失敗');
}

//DBのバージョン更新(DBの新規作成も含む)時のみ実行
openReq.onupgradeneeded = function (event) {
    var db = event.target.result;
    const objectStore = db.createObjectStore(storeName, {keyPath : 'id',autoIncrement : true })
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.createIndex("lat", "lat", { unique: false });
    objectStore.createIndex("long", "long", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });


    console.log('DB更新');
}

//onupgradeneededの後に実行。更新がない場合はこれだけ実行
openReq.onsuccess = function (event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readonly');
    var store = trans.objectStore(storeName);

    var weather = [];

    store.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
      if (cursor) {
	var table = document.getElementById('locationTable');
	var newRow = table.insertRow();

	var newCell = newRow.insertCell();
	var newText = document.createTextNode(cursor.value.lat);	
	newCell.appendChild(newText);

	newCell = newRow.insertCell();
	newText = document.createTextNode(cursor.value.long);
	newCell.appendChild(newText);

	newCell = newRow.insertCell();
	newText = document.createTextNode(cursor.value.time);
	newCell.appendChild(newText);

    	cursor.continue();
	
	}
    else {
   // alert("Got all locations: " + locations);
    } 
   };


    document.getElementById('btnLocation').addEventListener('click', function () {
  
	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(
        		function (pos) {
                		var locationlat = pos.coords.latitude;
              			var locationlong = pos.coords.longitude;
                		var date = new Date().toLocaleString();
   
				var trans = db.transaction(storeName, "readwrite");
    				var store = trans.objectStore(storeName);
    				store.put({lat: locationlat,long:locationlong,time:date});

				var table = document.getElementById('locationTable');
				var newRow = table.insertRow();

				var newCell = newRow.insertCell();
				var newText = document.createTextNode(locationlat);	
				newCell.appendChild(newText);

				newCell = newRow.insertCell();
				newText = document.createTextNode(locationlong);
				newCell.appendChild(newText);

				newCell = newRow.insertCell();
				newText = document.createTextNode(date);
				newCell.appendChild(newText);

			});


        }
		//location.reload();
    });
    
    
     document.getElementById('btnLocationDel').addEventListener('click', function () {

		var db = event.target.result;
    	var trans = db.transaction(storeName, 'readwrite');
    	var store = trans.objectStore(storeName);
    
   	 	var request = store.clear();
		request.onsuccess = function (event) {
		// 全件削除後の処理
		alert("位置情報を全て削除しました。");
		location.reload();
		}
		
    });

    document.getElementById('btnLocationInterval').addEventListener('click', function () {
    
    alert("5秒ごとに位置情報を取得します。6回で終了します。");
    var count = 0;
    var getlocation = function(){
			if (navigator.geolocation) {
    		    	navigator.geolocation.getCurrentPosition(
    		    		function (pos) {
    		            	var locationlat = pos.coords.latitude;
    		          		var locationlong = pos.coords.longitude;
    		            	var date = new Date().toLocaleString();
   
							var trans = db.transaction(storeName, "readwrite");
    				    	var store = trans.objectStore(storeName);
    						store.put({lat: locationlat,long:locationlong,time:date});

							var table = document.getElementById('locationTable');
							var newRow = table.insertRow();

							var newCell = newRow.insertCell();
							var newText = document.createTextNode(locationlat);	
							newCell.appendChild(newText);

							newCell = newRow.insertCell();
							newText = document.createTextNode(locationlong);
							newCell.appendChild(newText);

							newCell = newRow.insertCell();
							newText = document.createTextNode(date);
							newCell.appendChild(newText);

					});
        	}
        	
        	count++;
	 }
	 
	var id = setInterval(function(){
    getlocation();
    if(count > 5){
      clearInterval(id);//idをclearIntervalで指定している
    }}, 5000);
    
    
    });

   //監視ID
    var watch_id;
    var count = 0;
    
	//位置情報の監視を開始
    document.getElementById('btnLocationWatch').addEventListener('click', function () {
    
    alert("位置情報の監視を開始します。");
    		if (navigator.geolocation) {
    		    	watch_id = navigator.geolocation.watchPosition(
    		    		function (pos) {
    		            	var locationlat = pos.coords.latitude;
    		          		var locationlong = pos.coords.longitude;
    		            	var date = new Date().toLocaleString();
   
							var trans = db.transaction(storeName, "readwrite");
    				    	var store = trans.objectStore(storeName);
    						store.put({lat: locationlat,long:locationlong,time:date});

							var table = document.getElementById('locationTable');
							var newRow = table.insertRow();

							var newCell = newRow.insertCell();
							var newText = document.createTextNode(locationlat);	
							newCell.appendChild(newText);

							newCell = newRow.insertCell();
							newText = document.createTextNode(locationlong);
							newCell.appendChild(newText);

							newCell = newRow.insertCell();
							newText = document.createTextNode(date);
							newCell.appendChild(newText);
	    				   	count++;
	 
					});
        	}
        	
     
	 
    
    });
    
    
    
    //位置情報の監視を終了
    document.getElementById('btnLocationClear').addEventListener('click', function () {
    
    alert("位置情報の監視を終了します。"+count+"回取得しました。");
			if (navigator.geolocation) {
    		    	watch_id = navigator.geolocation.clearWatch(watch_id);
      				count = 0;
        	}
        	
     
    
    });









































}