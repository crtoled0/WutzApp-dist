/*
 * Copyright (C) 2016 CRTOLEDO.
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
     * The actual constructor of the Global object
     */
    var ImgToolsImpl = {
        _version : 0.1,
        _config : {
        }
    };
	/**
     Private
    **/



    ImgToolsImpl.sortArray = function(arr,col2Comp){
        if(!arr || arr.length <= 1)
            return arr;
        var sortedArr = [];
        for(var i in arr){
            if(col2Comp){
               sortedArr = ImgToolsImpl.insertIntoSortedArray(sortedArr,arr[i],col2Comp);
            }
            else{
               sortedArr = ImgToolsImpl.insertIntoSortedArray(sortedArr,arr[i]);
            }
        }
        return sortedArr;
    };


    ImgToolsImpl.loadImg(options, callback) {
        var seconds = 0,
            maxSeconds = 10,
            complete = false,
            done = false;
        if (options.maxSeconds) {
            maxSeconds = options.maxSeconds;
        }
        function tryImage() {
            if (done)
                return;
            if (seconds >= maxSeconds) {
                callback({
                    err: 'timeout'
                });
                done = true;
                return;
            }
            if (complete && img.complete) {
                if (img.width && img.height) {
                    callback({
                        img: img
                    });
                    done = true;
                    return;
                }
                callback({err: '404'});
                done = true;
                return;
            } else if (img.complete) {
                complete = true;
            }
            seconds++;
            callback.tryImage = setTimeout(tryImage, 1000);
        };
        var img = new Image();
        img.onload = tryImage();
        img.src = options.src;
        tryImage();
  };

	var ImgTools = function(){};
	ImgTools.prototype = ImgToolsImpl;
	ImgTools = new ImgTools();
	window.imgT = ImgTools;
})(window, document);
