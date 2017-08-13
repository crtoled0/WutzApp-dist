/*
 * Copyright (C) 2017 CRTOLEDO.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */


;(function(window, document, undefined){
	"use strict";
        /**
     * The actual constructor of the GenTFunctions object
     */
    var WutzGMapsAPIImpl = {
        _version : 0.1,
        _config : {
           gmKey : null,
					 keys : {browserGAPIKey:"AIzaSyCUmViI6PWuNRffHoByiWqcSQ7Xt7MSQMg",
					 				 androidKey:"AIzaSyAi0mwFlF5jniTaorbXjB2xklLr2SowVbA",
									 iosGAPIKey:"AIzaSyAbW4YdgW4WJgYvqqSvUuVD1hzKDzyhgZU"
								   }
        }
    };
	/**
     Private
    **/

//Public
    WutzGMapsAPIImpl.load = function(wutzConfig,callback){
            var gmapsUrl="";
						wutzConfig = JSON.parse(JSON.stringify(wutzConfig));
						if(/Android/i.test(navigator.userAgent) ) {
					     gmapsUrl = "https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+this._config.keys.androidKey;
               this._config.gmKey = this._config.keys.androidKey;
            }
            else if(/webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)){
							  gmapsUrl = "https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+this._config.keys.iosGAPIKey;
                this._config.gmKey = this._config.keys.iosGAPIKey;
            }
            else{
							 gmapsUrl = "https://maps.google.com/maps/api/js?v=3.exp&libraries=geometry,places&ext=.js&key="+this._config.keys.browserGAPIKey;
               this._config.gmKey = this._config.keys.browserGAPIKey;
            }
				  var geoLocObj =  "<script id=\"geoLocLib\" type=\"text/javascript\" src=\""+gmapsUrl+"\"></script>";
          $("body").append(geoLocObj);
          var labelmarker = "<script id=\"markWLab\" src=\"https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js\"></script>";
          var waiting4GM = window.setInterval(function(){
            if(google){
                    $("body").append(labelmarker);
                    window.clearInterval(waiting4GM);
                    if(callback)
                      callback();
                }
          },100);
    };

    WutzGMapsAPIImpl.getStaticMapImgUrl = function(lat,lon,mwidth,mheight){
        var barMapUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lon+"&markers="+lat+","+lon+"&zoom=16&size="+mwidth+"x"+mheight+"&key="+this._config.gmKey;
        return barMapUrl;
    };

   WutzGMapsAPIImpl.getNearByBarsFromGPS = function(mapHolderId, callback){
		 if (navigator.geolocation) {
				 navigator.geolocation.getCurrentPosition(
						 function(position){
									 var lat = position.coords.latitude;
									 var lon = position.coords.longitude;
									 var latlon = new google.maps.LatLng(lat, lon);
									 var myOptions = {
					 		        zoom: 17,
					 		        center: latlon,
					 		        mapTypeId: google.maps.MapTypeId.ROADMAP
					 		    };
					 		    var map = new google.maps.Map(document.getElementById(mapHolderId), myOptions);
									callback({lat:lat,
														lon:lon,
														gmap:map});
						 },
						 function(error){
							 var message = "";
							 switch (error.code) {
									 case error.PERMISSION_DENIED:
											 callback({err:"gps_not_active"});
											 break;
									 case error.POSITION_UNAVAILABLE:
											 callback({err:"gps_timeout"});
											 break;
									 case error.TIMEOUT:
											 callback({err:"gps_timeout"});
											 break;
									 case error.UNKNOWN_ERROR:
											 callback({err:"gps_not_active"});
											 break;
							 }
						 },
						 {enableHighAccuracy:true, timeout: 6000});
		 }
		 else {
				 callback({err:"gps_not_active"});
		 }
	 };


	 WutzGMapsAPIImpl.drawBarMarkers = function(markersArr, map, callbackOnSelectBar){
		 var imageIcon = "./img/mark.png";
		 var markerBars = new Array();

		 for(var i in markersArr){
			 markerBars[i]= new MarkerWithLabel({
																			position: new google.maps.LatLng(markersArr[i].lat, markersArr[i].lon),
																			map: map,
																			title: markersArr[i].id,
																			labelContent: markersArr[i].id,
																			labelAnchor: new google.maps.Point(15, 65),
																			labelClass: "mapWutzLabels", // the CSS class for the label
																			labelInBackground: false,
																			icon: imageIcon
																		});


			 markerBars[i].addListener('click', function(){
							callbackOnSelectBar({id:this.title});
							console.log("Clicked Marker "+this.title);
		   });
		 }
	 };

	var WutzGMapsAPI = function(){};
	WutzGMapsAPI.prototype = WutzGMapsAPIImpl;
	WutzGMapsAPI = new WutzGMapsAPI();
	window.wmap = WutzGMapsAPI;
})(window, document);
