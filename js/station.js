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
						  
						  var data = this.response;
      					  console.log(data);
      					  
      					  for (var station in data) {
 							   console.log(data[station]['name'])
						  }
						  /*
						   var table = document.getElementById('nearestStation');
						
 						
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
						   */
      					     
      					  
      					  
      					  
      					  
      					  
      					  
						}

						// リクエストをURLに送信
						request.send();
						
						
						
						
						
						
						
						

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