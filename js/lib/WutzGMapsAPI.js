!function(e,t,a){"use strict";var o={_version:.1,_config:{gmKey:null}};o.load=function(t,a){var o="";/Android/i.test(navigator.userAgent)?(o="https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+t.androidGAPIKey,this._config.gmKey=t.androidGAPIKey):/webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)?(o="https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+t.iosGAPIKey,this._config.gmKey=t.iosGAPIKey):(o="https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+t.browserGAPIKey,this._config.gmKey=t.browserGAPIKey);var i='<script id="geoLocLib" type="text/javascript" src="'+o+'"><\/script>';$("body").append(i);var r=e.setInterval(function(){google&&($("body").append('<script id="markWLab" src="https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js"><\/script>'),e.clearInterval(r),a&&a())},100)},o.getStaticMapImgUrl=function(e,t,a,o){return"https://maps.googleapis.com/maps/api/staticmap?center="+e+","+t+"&markers="+e+","+t+"&zoom=16&size="+a+"x"+o+"&key="+this._config.gmKey},o.getNearByBarsFromGPS=function(e,a){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(o){var i=o.coords.latitude,r=o.coords.longitude,s=new google.maps.LatLng(i,r),n={zoom:17,center:s,mapTypeId:google.maps.MapTypeId.ROADMAP},c=new google.maps.Map(t.getElementById(e),n);a({lat:i,lon:r,gmap:c})},function(e){switch(e.code){case e.PERMISSION_DENIED:a({err:"gps_not_active"});break;case e.POSITION_UNAVAILABLE:case e.TIMEOUT:a({err:"gps_timeout"});break;case e.UNKNOWN_ERROR:a({err:"gps_not_active"})}},{enableHighAccuracy:!0,timeout:6e3}):a({err:"gps_not_active"})},o.drawBarMarkers=function(e,t,a){var o=new Array;for(var i in e)o[i]=new MarkerWithLabel({position:new google.maps.LatLng(e[i].lat,e[i].lon),map:t,title:e[i].id,labelContent:e[i].id,labelAnchor:new google.maps.Point(15,65),labelClass:"mapWutzLabels",labelInBackground:!1,icon:"./img/mark.png"}),o[i].addListener("click",function(){a({id:this.title}),console.log("Clicked Marker "+this.title)})};var i=function(){};i.prototype=o,i=new i,e.wmap=i}(window,document);