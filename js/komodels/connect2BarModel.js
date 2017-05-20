function Connect2BarModel() {
    var mainMod = this;
//Private
   var catsLoaded;
   var guid;

    //Funct
    var initGPSetup = function(mod){
        koMods["main"].openLoading();
        wmap.load(koMods["main"].config(),function(){
          koMods["main"].closeLoading();
          console.log("Google Maps API loaded");
        });
    };

    var initDevUsrSetup = function(mod){
      var kuki = window.localStorage;
      if(device.uuid && device.uuid !== ""){
          guid = device.uuid;
      }
      else if(kuki.getItem("guid") && kuki.getItem("guid") !== ""){
          guid = kuki.getItem("guid");
      }
      else{
          guid = gF.generateUUID();
      }
      kuki.setItem("guid",guid);
      console.log("Setted GUID "+guid);
    };

//Public
    mainMod.bars = ko.observableArray([]);
    mainMod.openGPS = ko.observable(false);
    mainMod.pickedBar = ko.observable();
    mainMod.canClose = ko.computed(function(){
        if(koMods["main"].barLoaded())
           return true;
        else
           return false;
    },this);
    mainMod.checkIfTokenSetted = function(barId){
      if(localStorage.getItem("tokenCache")){
        var tokenCache = JSON.parse(localStorage.getItem("tokenCache"));
        var tokenLoaded;
        if(!barId){
            $("#searchBarInput").val(tokenCache.default.barId);
            mainMod.searchBars(function(){
              if(mainMod.bars().length > 0){
                   mainMod.showBarDetails(mainMod.bars()[0],function(){
                        $("#inputTokenBar input").val(tokenCache.default.dayToken);
                        mainMod.connect2Bar();
                        return true;
                   });
               }
               else {
                 return false;
               }
            });
        }
        else{
          if(tokenCache[barId])
            $("#inputTokenBar input").val(tokenCache[barId].dayToken);
          else
            $("#inputTokenBar input").val("");
        }
      }
      else{
         return false;
      }
    }

    mainMod.init = function(){
      console.log("Init Connect2BarModel ...");
      initDevUsrSetup();
      initGPSetup();
      $("#searchBarBody").slideDown();
      $("#detailsBarBody").slideUp();
      mainMod.checkIfTokenSetted();
    };

    mainMod.refresh = function(){
      $("#searchBarBody").slideDown();
      $("#detailsBarBody").slideUp();
    };

    mainMod.searchBars = function(callback){
      mainMod.bars([]);
      mainMod.openGPS(false);
      var barId = $("#searchBarInput").val();
      console.log(barId);
      koMods["main"].openLoading();
      window.wutzAdmin.callService({service:"searchBar/"+barId},function(_res){
            koMods["main"].closeLoading();
            console.log(_res);
            mainMod.bars(_res);
            if(_res.length === 0){
              var msg = {type:"danger",
                        title: locale.trans("msg_bardoesnt_exist_title"),
                        msg:   locale.trans("msg_bardoesnt_exist")};
               koMods["main"].displayGetMessage(msg);
            }
            if(callback)
               callback();
      });
    };

    mainMod.searchBarsByGPS = function(){
        mainMod.bars([]);
        mainMod.openGPS(true);
        koMods["main"].openLoading();
        wmap.getNearByBarsFromGPS("mapHolder",function(_res){
            koMods["main"].closeLoading();
            if(!_res.err){
                console.log(_res);
                var currPosAndMap = _res;
                if(currPosAndMap.lat && currPosAndMap.lon){
                  koMods["main"].openLoading();
                  window.wutzAdmin.callService({service:"getNearByBars/"+currPosAndMap.lat+"/"+currPosAndMap.lon},function(_res){
                        koMods["main"].closeLoading();
                        console.log(_res);
                        wmap.drawBarMarkers(_res, currPosAndMap.gmap, function(selBar){
                             mainMod.showBarDetails(selBar);
                        });
                  });
                }
            }
            else{
              var msg = {type:"danger",
                        title: "",
                        msg:   locale.trans(_res.err)};
               koMods["main"].displayGetMessage(msg);
               mainMod.openGPS(false);
            }
        });
    };

    mainMod.showBarDetails = function(selBar,callback){
       var mw = $("#detailsBarBody .barDescMap").parent().parent().width();
       var mh = ($("#detailsBarBody .barDescMap").css("height")).replace("px","");
       //getComputedStyle(parentElement).fontSize);
       console.log(mw + " -- "+mh);
       koMods["main"].openLoading();
       window.wutzAdmin.callService({service:"getBar/"+selBar.id},function(_res){
             koMods["main"].closeLoading();
             wtzCache.loadBarCachedInfo(_res.id, _res.idcatalog, _res.catVersion);
             console.log(_res);
             mainMod.pickedBar(_res);
             koMods["main"].barLoaded(_res);
             var mapImgUrl = wmap.getStaticMapImgUrl(_res.lat,_res.lon,mw,mh);
             $("#detailsBarBody .barDescMap").html("<img src=\""+mapImgUrl+"\" />");
             koMods["main"].fillArtists();
             mainMod.checkIfTokenSetted(_res.id);
             if(callback)
                  callback();
       });
       $("#searchBarBody").slideUp();
       $("#detailsBarBody").slideDown();
    };

    mainMod.justDisplayBarDetails = function(){
      $("#searchBarBody").slideUp();
      $("#detailsBarBody").slideDown();
    };

    mainMod.connect2Bar = function(){
       var loadedBar = koMods["main"].barLoaded();
        var dayToken = $("#inputTokenBar input").val();
        var par = {catId:loadedBar.idcatalog,
                   token:dayToken};
          koMods["main"].openLoading();
          window.wutzAdmin.callService({service:"checkToken",method:"POST",params:par},function(_res){
              koMods["main"].closeLoading();
              console.log(_res);
              if(_res.tokenOK){
                 loadedBar.connected = true;
                 loadedBar.dayToken = dayToken;
                 koMods["main"].barLoaded(loadedBar);
                 $("#connect2BarContainer").modal("hide");
                 var barTokensLoaded = localStorage.getItem("tokenCache");
                 if(!barTokensLoaded){
                     barTokensLoaded = {default:{}};
                 }
                 else{
                      barTokensLoaded = JSON.parse(barTokensLoaded);
                 }
                 barTokensLoaded["default"] = { barId:loadedBar.id,
                                                dayToken:dayToken
                                              };

                 barTokensLoaded[loadedBar.id] = {dayToken:dayToken};
                 localStorage.setItem("tokenCache",JSON.stringify(barTokensLoaded));
              }
              else{
                var msg = {type:"danger",
                          title: locale.trans("not_connected"),
                          msg: locale.trans("no_connected_msg")};
                koMods["main"].displayGetMessage(msg);
              }
          });
    //  koMods["main"].barLoaded(pickedBar);
    //  mainMod.canClose(true);
    };
}
