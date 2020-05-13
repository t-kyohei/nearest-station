/*
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
*/
//onupgradeneededの後に実行。更新がない場合はこれだけ実行
/*
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

*/
    document.getElementById('getNearest').addEventListener('click', function () {
  
	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(
        		function (pos) {
                		var locationlat = pos.coords.latitude;
              			var locationlong = pos.coords.longitude;
                		var date = new Date().toLocaleString();
   
				        
				        // XMLHttpRequestオブジェクトの作成
						var request = new XMLHttpRequest();
						
						// URLを開く
						var URL = "https://express.heartrails.com/api/json?method=getStations&x="+locationlong+"&y="+locationlat+"";
						request.open('GET', URL, true);

						// レスポンスが返ってきた時の処理を記述 
						request.onload = function () {
						  // レスポンスが返ってきた時の処理
						  
						  var data = this.response.response.station;
						  if(data != null){
      					  console.log(data);
      					  var station =data[0];
      					  
      					  var table = document.getElementById('nearestStation');
						
      					  	for (var num in data) {
 							     var  station = data[num];
   						   		var newRow = table.insertRow();

   						   		//ボタン追加
   						   	   	var newCell = newRow.insertCell();	
   						   		const addButton = document.createElement('button');
    							addButton.classList.add('btn');
    							addButton.classList.add('btn-outline-secondary');
    							addButton.type = 'button';
  								addButton.value = station;
  								newText = document.createTextNode("ここに行く");
  								addButton.appendChild(newText);
						   		newCell.appendChild(addButton);
						   		
						   		//駅名
						   		newCell = newRow.insertCell();
						   		newText = document.createTextNode(station['name']);
						   		newCell.appendChild(newText);
 						 		//路線名
						   		newCell = newRow.insertCell();
						   		newText = document.createTextNode(station['line']);
						   		newCell.appendChild(newText);
								//都道府県
						   		newCell = newRow.insertCell();
						   		newText = document.createTextNode(station['prefecture']);
						   		newCell.appendChild(newText);
						   		
						   		//距離
						   		newCell = newRow.insertCell();
						   		newText = document.createTextNode(station['distance']);
						   		newCell.appendChild(newText);
						   
      					     
      					  
      					  	}
      					  
      					  
      					  }
      					  
						}

						// リクエストをURLに送信
						request.responseType = 'json';
						request.send();
						
						
						
						
						
						
						
						

			});


        }
		//location.reload();
    });
    
    /*
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
*/
