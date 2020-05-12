var CACHE_NAME = 'pwa-camera-test-caches-010';
var urlsToCache = ['./index.html?001', 
					'./btn.css?001',
					'./js/payment.js?004',
					'./camera/',
					'./location/index.html?001',
					'./location/js/location.js',
					'./location/',
					'./pay/'

					];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response ? response : fetch(event.request);
            })
    );
    
});


self.addEventListener("activate", function (event) {
  event.waitUntil(
    (function () {
      caches.keys().then(function (oldCacheKeys) {
        oldCacheKeys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});

self.addEventListener("message", function (event) {

    var count = 0;
    var date = event.value;
    
							var dbName = 'sampleDB';
var dbVersion = '1';
var storeName  = 'location';
var count = 0;
//　DB名を指定して接続
var openReq  = indexedDB.open(dbName, dbVersion);
// 接続に失敗
openReq.onerror = function (event) {
    console.log('接続失敗');
}
openReq.onupgradeneeded = function (event) {
    var db = event.target.result;
    const objectStore = db.createObjectStore(storeName, {keyPath : 'id',autoIncrement : true })
    objectStore.createIndex("id", "id", { unique: true });
    objectStore.createIndex("lat", "lat", { unique: false });
    objectStore.createIndex("long", "long", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });



    console.log('DB更新');
}

//DBのバージョン更新(DBの新規作成も含む)時のみ実行
openReq.onsuccess = function (event) {
    						var db = event.target.result;

							var trans = db.transaction(storeName, "readwrite");
    				    	var store = trans.objectStore(storeName);
    						store.openCursor().onsuccess = function(event) {
  							const row = event.target.result;
  if (row) {
    console.log(row.value);
    row.continue();
  }

}			

}
});


self.addEventListener('sync', function(evt) {
if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(
        		function (pos) {
                		var locationlat = pos.coords.latitude;
              			var locationlong = pos.coords.longitude;
     
     });
     
     }

  if (evt.tag.startsWith('send-msg:')) {
    var city = evt.tag.substr(9);
    //if (isNaN(id))
    //  return;
    //evt.waitUntil(sendAndDeleteMessage(id));
  
    var owmApiKey = "39a3a05db42fccac432e0a490c3bb389";
	var owmURL = "https://api.openweathermap.org/data/2.5/weather?lang=ja&q="+ city +"&APPID="+ owmApiKey +"";
      
    
    fetch(owmURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
         //天気予報情報取得
         console.log(myJson);          
         var main = myJson.weather[0].main+"("+myJson.weather[0].description+")";
         var description =myJson.weather[0].description;
         var cityName = myJson.name;
         var temp = myJson.main.temp;
         var diff = 273.15;
         
         
         
 /**
 * 気温計算処理
 */


/**
 * 与えられた値の小数点以下の桁数を返す 
 * multiply, subtractで使用
 * 
 * 例)
 *   10.12  => 2  
 *   99.999 => 3
 *   33.100 => 1
 */
Math._getDecimalLength = function(value) {
    var list = (value + '').split('.'), result = 0;
    if (list[1] !== undefined  && list[1].length > 0) {
        result = list[1].length;
    }
    return result;
};
/**
 * 乗算処理
 *
 * value1, value2から小数点を取り除き、整数値のみで乗算を行う。 
 * その後、小数点の桁数Nの数だけ10^Nで除算する
 */
Math.multiply = function(value1, value2) {
    var intValue1 = +(value1 + '').replace('.', ''),
        intValue2 = +(value2 + '').replace('.', ''),
        decimalLength = Math._getDecimalLength(value1) + Math._getDecimalLength(value2),
        result;

    result = (intValue1 * intValue2) / Math.pow(10, decimalLength);

    return result;
};

/**
 * 減算処理
 *
 * value1,value2を整数値に変換して減算
 * その後、小数点の桁数分だけ小数点位置を戻す
 */
Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

var tempja = Math.subtract(temp, diff);
         
/*
*取得した天気予報情報をローカルに保存
*
*/
var dbName = 'sampleDB';
var dbVersion = '2';
var storeName  = 'weather';
var count = 0;

//DB名を指定して接続
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
    objectStore.createIndex("city", "city", { unique: false });
    objectStore.createIndex("main", "main", { unique: false });
    objectStore.createIndex("temp", "temp", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });
    console.log('DB更新');
}

//onupgradeneededの後に実行。更新がない場合はこれだけ実行
openReq.onsuccess = function (event) {
				var date = new Date().toLocaleString();
         		var db = event.target.result;
				var trans = db.transaction(storeName, "readwrite");
    			var store = trans.objectStore(storeName);
    			store.put({city: cityName,main:main,temp:tempja,time:date});
}


/*
*天気取得を通知
*
*/

    var title = "天気予報情報を取得しました。";
    var body = cityName+"の天気は"+main+"です。";

    
        self.registration.showNotification(title, {
            body: body,
            icon: '',
            tag: 'push-notification-tag'
        })
    ;
  
   });
  }

});




/**
*
*天気予報取得処理
**/

/*
   //都市名を定義
//var cityName = document.getElementById("city").value;

//openweathermap（天気予報API）に接続
//var request = new XMLHttpRequest();
var owmApiKey = "39a3a05db42fccac432e0a490c3bb389";
var owmURL = "https://api.openweathermap.org/data/2.5/weather?lang=ja&q=tokyo&APPID="+ owmApiKey +"";

//request.open('GET', owmURL, true);
//結果をjson型で受け取る
//request.responseType = 'json';

//request.onload = function () {
 var data = this.response;
 console.log(data);
 var temp = data["main"]["temp"];
 //気温は-273.15する。
 var diff = 273.15;

*/
 /**
 * Mathオブジェクトを拡張 
 */


/**
 * 与えられた値の小数点以下の桁数を返す 
 * multiply, subtractで使用
 * 
 * 例)
 *   10.12  => 2  
 *   99.999 => 3
 *   33.100 => 1
 */
 /*
Math._getDecimalLength = function(value) {
    var list = (value + '').split('.'), result = 0;
    if (list[1] !== undefined  && list[1].length > 0) {
        result = list[1].length;
    }
    return result;
};
/**
 * 乗算処理
 *
 * value1, value2から小数点を取り除き、整数値のみで乗算を行う。 
 * その後、小数点の桁数Nの数だけ10^Nで除算する
 */
 /*
Math.multiply = function(value1, value2) {
    var intValue1 = +(value1 + '').replace('.', ''),
        intValue2 = +(value2 + '').replace('.', ''),
        decimalLength = Math._getDecimalLength(value1) + Math._getDecimalLength(value2),
        result;

    result = (intValue1 * intValue2) / Math.pow(10, decimalLength);

    return result;
};

/**
 * 減算処理
 *
 * value1,value2を整数値に変換して減算
 * その後、小数点の桁数分だけ小数点位置を戻す
 */
 /*
Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

var tempja = Math.subtract(temp, diff);
var city = data["name"];
var main = data["weather"][0]["main"];
 
 

if ("Notification" in window) {
    var permission = Notification.permission;

    if (permission === "denied") {
      return;
    }

//    Notification
//      .requestPermission()
//      .then(function() {
//        var notification = new Notification("Hello, world!");
//    });
  }
  
  /**
  *取得した天気予報情報を登録
  *
  **/
  /*
                var date = new Date().toLocaleString();
   
				var trans = db.transaction(storeName, "readwrite");
    			var store = trans.objectStore(storeName);
    			store.put({city: city,main:main,temp:tempja,time:date});

				var table = document.getElementById('weatherTable');
				var newRow = table.insertRow();

				var newCell = newRow.insertCell();
				var newText = document.createTextNode(city);	
				newCell.appendChild(newText);

				newCell = newRow.insertCell();
				newText = document.createTextNode(main);
				newCell.appendChild(newText);

				newCell = newRow.insertCell();
				newText = document.createTextNode(tempja);
				newCell.appendChild(newText);

				newCell = newRow.insertCell();
				newText = document.createTextNode(date);
				newCell.appendChild(newText);
			
	};
	//request.send();
	
	

*/


