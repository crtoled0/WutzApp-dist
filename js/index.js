/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      //document.addEventListener("deviceready", onDeviceReady, false);
      var mainApp = this;
      if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
          document.addEventListener("deviceready", function(){
              console.log("Device is ready or not ?");
              mainApp.onDeviceReady();
          }, false);
        }
        else{
          var tries = 0;
          var inter = setInterval(function(){
            if(tries < 20){
              tries++;
              if(device !== undefined){
                 clearInterval(inter);
                 mainApp.onDeviceReady();
              }
              console.log(tries);
            }
            else{
              clearInterval(inter);
              mainApp.onDeviceReady();
            }
          },100);
        }
      //  document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      // Once APP is LOAD use this
      //  app.receivedEvent('deviceready');
      var mainMod = this;
      navigator.globalization.getPreferredLanguage(
        function (language) {
          console.log("Setted Language "+language.value.split("-")[0]);
          mainMod.setTransLang(language.value.split("-")[0]);
        },
        function () {
          console.log("Error Loading language, loading EN by default");
          mainMod.setTransLang("en");
        });
    },
    setTransLang: function(lng){
      locale.loadWutzTranslator(lng, function(){
        burstflyInit();
        // Activates knockout.js
        koMods["main"] = new MainModel();
        ko.applyBindings(koMods["main"]);
        koMods["main"].init();
      });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};
