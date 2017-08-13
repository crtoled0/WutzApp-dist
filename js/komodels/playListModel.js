function PlayListModel() {
    var mainMod = this;
    //Private
    var artPicMapp;
    var checkInterval;
    var loadArtPics = function(){
      if(!artPicMapp){
        artPicMapp = {};
          for(var i in koMods["main"].artists()){
             var art = koMods["main"].artists()[i];
             artPicMapp[art.name] = art.lfm_img_url;
          }
      }
      return artPicMapp;
    };
    //----------------------------

    mainMod.songs = ko.observableArray([]);

    mainMod.init = function(){
      console.log("PlayListModel Loaded");
    };

    mainMod.loadCurrentPlayList = function(callback){
        var artPicMapp = loadArtPics();
        var song2Load = [];
        var params = {token : koMods["main"].barLoaded().dayToken,
                      catId : koMods["main"].barLoaded().idcatalog};
        if(!checkInterval)
          koMods["main"].openLoading();
        window.wutzAdmin.callService({service:"getCurrentPlayList/",method:"POST",params:params},function(_res){
          if(!checkInterval)
              koMods["main"].closeLoading();
            for(var i in _res){
               var sng = _res[i];
               if(sng.album_info && sng.album_info !== ""){
                 var albPics = JSON.parse(sng.album_info);
                 for(var x in albPics.album.image){
                   var imgNode = albPics.album.image[x];
                   if(imgNode.size === "medium"){
                       sng.pic = imgNode["#text"];
                   }
                 }
               }
               else{

                   console.log(artPicMapp[sng.artist]);
                   sng.pic = artPicMapp[sng.artist];
               }
               song2Load.push(sng);
            }
            mainMod.songs(song2Load);
            if(callback)
              callback();

            if(!checkInterval){
                checkInterval = setInterval(function(){
                     mainMod.loadCurrentPlayList();
                },10000);
            }
        });
    }

    mainMod.stopCheckingPlayList = function(){
          clearInterval(checkInterval);
          checkInterval=null;
    };
}
