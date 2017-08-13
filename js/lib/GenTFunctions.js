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
    var GenTFunctionsImpl = {
        _version : 0.1,
        _config : {
        }
    };
	/**
     Private
    **/

//Public
    GenTFunctionsImpl.generateUUID = function(){
        var d = new Date().getTime();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    } ;

	var GenTFunctions = function(){};
	GenTFunctions.prototype = GenTFunctionsImpl;
	GenTFunctions = new GenTFunctions();
	window.gF = GenTFunctions;
})(window, document);
