var dbName = 'stationDB';
var dbVersion = '1';
var storeName  = 'station';
var storeName2  = 'location';
var count = 0;

//stationidを取得
var id = Number(getParam('id'));

//目的地の経度・緯度
var dlong ="";
var dlat ="";


//クエリパラメータの取得
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var openReq = indexedDB.open(dbName);

openReq.onsuccess = function (event) {
    var db = event.target.result;
    var trans = db.transaction(storeName, 'readonly');
    var store = trans.objectStore(storeName);
    var request = store.get(id);

    request.onerror = function(event) {
  // エラー処理!
	};
	request.onsuccess = function(event) {
  //idから目的地のデータを取得。
  	var data = event.target.result;
  	//駅名を追加
  	var node = document.getElementById('destination');
  	var newText =  document.createTextNode(data.name+"駅("+data.line+")");
  	node.appendChild(newText);
  	//位置情報をセット
  	dlong =data.longitude;
    dlat = data.latitude;
   	};
	
/*
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
    */
	
	
   };



/*
*
*距離を計算する関数
*/
function distance(lat1, lng1, lat2, lng2) {
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}


/*
*取得ボタン押下時に、距離を計算
*/
document.getElementById('getDistance').addEventListener('click', function () {

getDistance();

 });

/*
*停止ボタン押下時に、距離を計算を停止
*/
document.getElementById('stopDistance').addEventListener('click', function () {

stopDistance();

 });
/*
*
*現在地と目的地に距離を計算開始
*/

var watch_id;

function getDistance(){
  
	if (navigator.geolocation) {
        	watch_id=navigator.geolocation.watchPosition(
        		function (pos) {
                		var locationlat = pos.coords.latitude;
              			var locationlong = pos.coords.longitude;
                		var date = new Date().toLocaleString();
                		var distannce = distance(locationlat, locationlong, dlat, dlong) ;
                		var displayDistannce = Math.round(Number(distannce)*1000);
                		//距離を追加
                		var node = document.getElementById('distance');
  						var newText =  document.createTextNode(displayDistannce+"m ("+date+"時点)");
  						if(node.childNodes.length != 0){
  						node.removeChild(node.firstChild);
  						}
  						node.appendChild(newText);
                		
                		
                },
			
			  function( error ){
				},
				{
					"enableHighAccuracy": true,
					"timeout": 8000,
					"maximumAge": 2000,
				});
            }
            
}



/*
*
*現在地と目的地に距離を計算停止
*/

function stopDistance(){
	if (navigator.geolocation) {
    		    	watch_id = navigator.geolocation.clearWatch(watch_id);
        	}
            
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

/*
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

*/
    
    
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


/*
*
*googleMap取得
*/
var map;
var marker = [];
var infoWindow = [];
var markerData = [ // マーカーを立てる場所名・緯度・経度
  {
       name: 'TAM 東京',
       lat: 35.6954806,
        lng: 139.76325010000005,
        icon: 'tam.png' // TAM 東京のマーカーだけイメージを変更する
 }, {
        name: '小川町駅',
     lat: 35.6951212,
        lng: 139.76610649999998
 }, {
        name: '淡路町駅',
     lat: 35.69496,
      lng: 139.76746000000003
 }, {
        name: '御茶ノ水駅',
        lat: 35.6993529,
        lng: 139.76526949999993
 }, {
        name: '神保町駅',
     lat: 35.695932,
     lng: 139.75762699999996
 }, {
        name: '新御茶ノ水駅',
       lat: 35.696932,
     lng: 139.76543200000003
 }
];
initMap();
function initMap() {
 // 地図の作成
    var mapLatLng = new google.maps.LatLng({lat: markerData[0]['lat'], lng: markerData[0]['lng']}); // 緯度経度のデータ作成
   map = new google.maps.Map(document.getElementById('map'), { // #sampleに地図を埋め込む
     center: mapLatLng, // 地図の中心を指定
      zoom: 15 // 地図のズームを指定
   });
 
 // マーカー毎の処理
 for (var i = 0; i < markerData.length; i++) {
        markerLatLng = new google.maps.LatLng({lat: markerData[i]['lat'], lng: markerData[i]['lng']}); // 緯度経度のデータ作成
        marker[i] = new google.maps.Marker({ // マーカーの追加
         position: markerLatLng, // マーカーを立てる位置を指定
            map: map // マーカーを立てる地図を指定
       });
 
     infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
         content: '<div class="sample">' + markerData[i]['name'] + '</div>' // 吹き出しに表示する内容
       });
 
     markerEvent(i); // マーカーにクリックイベントを追加
 }
 
   marker[0].setOptions({// TAM 東京のマーカーのオプション設定
        icon: {
         url: markerData[0]['icon']// マーカーの画像を変更
       }
   });
}
 
// マーカーにクリックイベントを追加
function markerEvent(i) {
    marker[i].addListener('click', function() { // マーカーをクリックしたとき
      infoWindow[i].open(map, marker[i]); // 吹き出しの表示
  });
  }



