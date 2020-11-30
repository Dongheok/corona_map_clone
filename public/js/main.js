$(document).ready(function () {
   let currentDate = new Date();
   let currentYear = currentDate.getFullYear();
   let currentMonth = currentDate.getMonth() + 1;
   let currentDay = currentDate.getDate() >= 10 ? currentDate.getDate() : '0' + currentDate.getDate();
   let currentDateResult = `${currentYear}.${currentMonth}.${currentDay}`;
   $('.date').text(currentDateResult);
   // map
   var mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
   };

   var map = new naver.maps.Map('map', mapOptions);

   // marker
   var markerList = [];
   var infoWindowList = [];
   for (var i in data) {
      var target = data[i];
      var latlng = new naver.maps.LatLng(target.lat, target.lng);
      marker = new naver.maps.Marker({
         map: map,
         position: latlng,
         icon: {
            content: "<div class='marker'></div>",
            anchor: new naver.maps.Point(12, 12),
         },
      });
      // infoWindow
      var content = `
   <div class="info_window_wrap">
      <div class="info_window_title">
         ${target.title}
      </div>   
      <div class="info_window_content">
         ${target.content}
      </div>   
      <div class="info_window_date">
         ${target.date}
      </div>   
   </div>
   `;
      var infoWindow = new naver.maps.InfoWindow({
         content: content,
         backgroundColor: '#00ff0000',
         borderColor: '#00ff0000',
         anchor: new naver.maps.Size(0, 0),
      });

      markerList.push(marker);
      infoWindowList.push(infoWindow);
   }
   for (var i = 0; i < markerList.length; i++) {
      naver.maps.Event.addListener(map, 'click', ClickMap(i));
      naver.maps.Event.addListener(markerList[i], 'click', getClickHandler(i));
      // map 클릭 이벤트
      function ClickMap(i) {
         return function () {
            var infoWindow = infoWindowList[i];
            infoWindow.close();
         };
      }
      // infoWindow 클릭 이벤트
      function getClickHandler(i) {
         return function () {
            var marker = markerList[i];
            var infoWindow = infoWindowList[i];
            if (infoWindow.getMap()) {
               infoWindow.close();
            } else {
               infoWindow.open(map, marker);
            }
         };
      }
      // current 클릭 이벤트 : 현재위치 표시
      let currentSw = true;
      $('#current').click(() => {
         if ('geolocation' in navigator) {
            // 위치정보 사용 가능
            navigator.geolocation.getCurrentPosition(function (position) {
               const lat = position.coords.latitude;
               const lng = position.coords.longitude;
               const latLng = new naver.maps.LatLng(lat, lng);
               if (currentSw) {
                  marker = new naver.maps.Marker({
                     map: map,
                     position: latLng,
                     icon: {
                        content: `<img class="pulse" draggable="false" unselectable="on" src="https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png" />`,
                        anchor: new naver.maps.Point(11, 11),
                     },
                  });
                  currentSw = false;
               }
               map.setZoom(14, false);
               map.panTo(latLng);
            });
         } else {
            // 위치정보 사용 불가능
            alert('위치정보 사용 불가능');
         }
      });
      // search
      let ps = new kakao.maps.services.Places();
      let search_arr = [];
      $('.input_search').on('keydown', function (e) {
         if (e.keyCode === 13) {
            let content = $(this).val();
            ps.keywordSearch(content, placeSearchCB);
         }
      });

      $('.btn_search').on('click', function (e) {
         let content = $('.input_search').val();
         ps.keywordSearch(content, placeSearchCB);
      });

      function placeSearchCB(data, status, pagination) {
         if (status === kakao.maps.services.Status.OK) {
            let target = data[0];
            const lat = target.y;
            const lng = target.x;
            const latLng = new naver.maps.LatLng(lat, lng);
            marker = new naver.maps.Marker({
               position: latLng,
               map: map,
            });
            if (search_arr.length === 0) {
               search_arr.push(marker);
            } else {
               search_arr.push(marker);
               let pre_marker = search_arr.splice(0, 1);
               pre_marker[0].setMap(null);
            }
            map.setZoom(14, false);
            map.panTo(latLng);
         } else {
            alert('검색결과가 없습니다.');
         }
      }
   }
});
