var dbName = 'stationDB';
var dbVersion = '2';
var storeName  = 'station';
var storeName2  = 'location';

var CACHE_NAME = 'station-test-caches-006';
var urlsToCache = ['./index.html?002', 
					'./js/station.js?003',
					'./import/bootstrap.min.css?001',
					'./import/bootstrap.min.js?001',
					'./import/jquery-3.3.1.js?001',
					'./station/index.html?002',
					'./css/main.css?001',
					'./station/img/load.gif?001',
					'./station/img/now.png?001',
					'./station/img/past.png?001',
					'./station/css/location.css?001',
					'./station/js/location.js?001'
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
    // リクエストに一致するデータがキャッシュにあるかどうか
    caches.match(event.request).then(function(cacheResponse) {
      // キャッシュがあればそれを返す、なければリクエストを投げる
      return cacheResponse || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          // レスポンスをクローンしてキャッシュに入れる
          cache.put(event.request, response.clone());
          // オリジナルのレスポンスはそのまま返す
          return response;
        });  
      });
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



/*
*
*オンライン同期
*/


var click ="/";
var stationName = "";
var stationid = "";

self.addEventListener('sync', function(evt) {

  if (evt.tag.startsWith('x:')) {
    var str = evt.tag;
    var result = str.split('/');
    var x = result[0].substr( 2 );
    var y = result[1].substr( 2 );
    
	var owmURL = "https://express.heartrails.com/api/json?method=getStations&x="+x+"&y="+y+"";
      
    
    fetch(owmURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
         //最寄り駅情報取得
         console.log(myJson);          
         var station = myJson.response.station[0];
         //DBのstationを開く
  			var db;
			var request = indexedDB.open(dbName);
			request.onerror = function(event) {
  			 console.log('DB error');
  					};
			request.onsuccess = function(event) {
 	 		db = event.target.result;
 	 		var trans = db.transaction(storeName, 'readonly');
    		var store = trans.objectStore(storeName);
    		store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
           if (cursor) {
                if(cursor.value.name == station['name'] && cursor.value.line == station['line']){
                  var value = cursor.value.id;
                  stationid = value;
                  stationName = cursor.value.name;
                  
                }else{ 
                	cursor.continue();
                }
              
           }else{
           
            //駅の登録後遷移
		  	//DBのstationを更新で開く
 	 		var trans = db.transaction(storeName, 'readwrite');
    		var store = trans.objectStore(storeName);
    		var putReq = store.put({name:station['name'],prefecture:station['prefecture'],line:station['line'],longitude:station['x'],latitude:station['y'],postal:station['postal']});
    		stationName = station['name'];
    		
    		putReq.onsuccess = function(e){
     		//登録時に実行
     		var id = e.target.result;
     		 console.log('put data success');
     		 stationid = e.target.result;
     		
    		};

		    trans.oncomplete = function(){
    		// トランザクション完了時(putReq.onsuccessの後)に実行
      		 console.log('transaction complete');
    		};
    		 
    		 
		   }
          
           
           }
           }
       

/*
*最寄り駅取得を通知
*
*/

    var title = "最寄り駅情報を取得しました。";
    var body = stationName+"駅に行きましょう。";
    click = "https://t-kyohei.github.io/nearest-station/station/?id="+stationid+"";
    
    
        self.registration.showNotification(title, {
            body: body,
            icon: 'img/icon.jpg',
            tag: 'push-notification-tag',
        })
    ;
  
   });
  }

});



self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    clients.openWindow(click);
}, false);

