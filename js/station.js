var nowdata = "";


var dbName = 'stationDB';
var dbVersion = '1';
var storeName  = 'station';
var storeName2  = 'location';
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
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("prefecture", "prefecture", { unique: false });
    objectStore.createIndex("line", "line", { unique: false });
    objectStore.createIndex("longitude", "longitude", { unique: false });
    objectStore.createIndex("latitude", "latitude", { unique: false });
    objectStore.createIndex("postal", "postal", { unique: false });
    
    
    
    const objectStore2 = db.createObjectStore(storeName2, {keyPath : 'id',autoIncrement : true })
    objectStore2.createIndex("id", "id", { unique: true });
    objectStore2.createIndex("staionid", "staionid", { unique: false });
    objectStore2.createIndex("longitude", "longitude", { unique: false });
    objectStore2.createIndex("latitude", "latitude", { unique: false });
    objectStore2.createIndex("time", "time", { unique: false });
    objectStore2.createIndex("distance", "distance", { unique: false });

    console.log('DB更新');
}

//onupgradeneededの後に実行。更新がない場合はこれだけ実行
openReq.onsuccess = function (event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readonly');
    var store = trans.objectStore(storeName);


    store.openCursor().onsuccess = function(event) {
    
    var cursor = event.target.result;
      if (cursor) {
	var table = document.getElementById('pastStation');
    
    var newRow = table.insertRow();

    //ボタン追加
    	var newCell = newRow.insertCell();	
   		const addButton = document.createElement('button');
   		addButton.classList.add('btn');
   		addButton.classList.add('btn-outline-secondary');
   		addButton.classList.add('past-station');
   		addButton.type = 'button';
  		addButton.value = cursor.value.id;
  		//addButton.id = 'paststation'+num;
  		addButton.addEventListener('click', goStation, false);
  		var newText = document.createTextNode("ここに行く");
  		addButton.appendChild(newText);
 		newCell.appendChild(addButton);
 		
 		//駅名
 		//var innerText = station['name']+"駅<br>"+station['line']
 		newCell = newRow.insertCell();
 		newText = document.createTextNode(cursor.value.name);
 		newCell.appendChild(newText);
 		//路線名
 		newCell = newRow.insertCell();
 		newText = document.createTextNode(cursor.value.line);
 		newCell.appendChild(newText);
		//都道府県
 		newCell = newRow.insertCell();
 		newText = document.createTextNode(cursor.value.prefecture);
 		newCell.appendChild(newText);

    	cursor.continue();
	
	}
    else {
   // alert("Got all locations: " + locations);
    } 
   };

 };


/*
*
*選択した履歴の駅を表示する。
*/

 function goStation(){
  	var id = this.value;
    window.location.href = 'station/?id='+id+'';
  	 			    

    }
/*
*
*選択した最寄り駅を表示する。
*/

    function setStation(){

    //var v = val;
  	var value = this.value;
  	var station = window.nowdata[value];
  	
  	//DBのstationを開く
	  	    var db;
			var request = indexedDB.open(dbName);
			request.onerror = function(event) {
  			 console.log('DB error');
  					};
			request.onsuccess = function(event) {
 	 		db = event.target.result;
 	 		var trans = db.transaction(storeName, 'readwrite');
    		var store = trans.objectStore(storeName);
    		var putReq = store.put({name:station['name'],prefecture:station['prefecture'],line:station['line'],longitude:station['x'],latitude:station['y'],postal:station['postal']});
    		
    		
    		putReq.onsuccess = function(e){
     		//登録時に実行
     		var id = e.target.result;
     		 console.log('put data success');
     		 window.location.href = 'station/?id='+id+'';
    		}

		    trans.oncomplete = function(){
    		// トランザクション完了時(putReq.onsuccessの後)に実行
      		 console.log('transaction complete');
    		}
			};
    		
     	
    		
  	
 			    

    }

/*
*
*最寄り駅を取得する。
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
						  window.nowdata = data;
						  if(data != null){
      					  console.log(data);
      					  var station =data[0];
      					  
      					  var table = document.getElementById('nearestStation');
      					  
      					    while(table.rows[0]) {
      					  		table.deleteRow( 0 );
      					  	}  					  
						
      					  	for (var num in data) {
 							     var  station = data[num];
   						   		var newRow = table.insertRow();

   						   		//ボタン追加
   						   	   	var newCell = newRow.insertCell();	
   						   		const addButton = document.createElement('button');
    							addButton.classList.add('btn');
    							addButton.classList.add('btn-outline-secondary');
    							addButton.classList.add('station');
    							addButton.type = 'button';
  								addButton.value = num;
  								addButton.id = 'station'+num;
  								addButton.addEventListener('click', setStation, false);
  								var newText = document.createTextNode("ここに行く");
  								addButton.appendChild(newText);
						   		newCell.appendChild(addButton);
						   		
						   		//駅名
						   		var innerText = station['name']+"駅<br>"+station['line']
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
