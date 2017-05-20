function SongListModel() {
    var mainMod = this;

    mainMod.songs = ko.observableArray([]);

    mainMod.init = function(){
      console.log("SongListModel Loaded");
    };

    mainMod.loadSongList = function(){
      console.log("Loading Songs");
      var albSel = koMods["main"].currSelected().album;
      var catId =  koMods["main"].barLoaded().idcatalog;
      mainMod.songs([]);

      var cacheSongs = wtzCache.getSongs(albSel.idalbum);
      if(!cacheSongs){
          koMods["main"].openLoading();
          window.wutzAdmin.callService({service:"getSongsPerAlbum/"+catId+"/"+albSel.idalbum},function(_res){
                console.log(_res);
                mainMod.songs(_res);
                wtzCache.addSongs(albSel.idalbum, _res);
                koMods["main"].closeLoading();
          });
      }
      else
         mainMod.songs(cacheSongs);
    };

    mainMod.addItem = function(song){
      var loadedBar = koMods["main"].barLoaded();
      console.log(song);
      if(loadedBar.connected){
        var catId =  loadedBar.idcatalog;
        var guid = window.localStorage.getItem("guid");
        var params = {token : loadedBar.dayToken,
                      catId : catId,
                      songId : song.songid,
                      guid : guid};
          koMods["main"].openLoading();
          window.wutzAdmin.callService({service:"addSongToQueue/",method:"POST",params:params},function(_res){
                koMods["main"].closeLoading();
                console.log(_res);
                if(_res.added === "OK"){
                    var msg = {type:"success",
                              title:locale.trans("ok"),
                              msg: locale.trans("added_song_msg",{"SONGNAME":song.name})};
                    koMods["main"].displayGetMessage(msg);
                }
                else{
                  var errMsg=""
                  if(_res.msg === "added_max_songs")
                      errMsg = locale.trans("on_limit_msg",{"ALLOWED_SONGS":loadedBar.songsAllowed});
                  else if(_res.msg === "repeated")
                      errMsg = locale.trans("already_added",{"SONGNAME":song.name});
                  else if(_res.msg === "exptoken"){
                      errMsg = locale.trans("expired_token");
                  }
                  else
                       errMsg = locale.trans("gen_failed_msg");

                  var msg = {type:"danger",
                            title:"",
                            msg:  errMsg};
                  koMods["main"].displayGetMessage(msg);
                }
          });
      }
      else{
         console.log("No Connected to Bar");
         var msg = {type:"danger",
                   title:"",
                   msg:locale.trans("expired_token")};
         koMods["main"].displayGetMessage(msg);
         koMods["main"].openConnect2Bar();
         $("#songListContainer").modal("hide");
      }
    };

}
