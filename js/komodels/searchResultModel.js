function SearchResultModel() {
    var mainMod = this;
    mainMod.seArtists = ko.observableArray([]);
    mainMod.seAlbums = ko.observableArray([]);
    mainMod.seSongs = ko.observableArray([]);

    mainMod.init = function(){
      console.log("SearchResultModel Loaded");
    };

    mainMod.applySearch = function(text){
          console.log("Searching ... " + text);
          var text = (text.toLowerCase()).replace(/\s/ig,"");
          var catalog = wtzCache.getBarCachedCatalog();
          mainMod.seArtists([]);
          mainMod.seAlbums([]);
          mainMod.seSongs([]);
          var finishedCounter = 0;

          searchAlbAndSongsOnCatalog(text, function(_seRes){
              mainMod.seSongs([]);
              mainMod.seAlbums([]);
              if(_seRes){
                  if(_seRes.albums)
                      mainMod.seAlbums(_seRes.albums);
                  if(_seRes.songs)
                      mainMod.seSongs(_seRes.songs);
              }
              finishedCounter++;
          });
          setTimeout(function(){
            searchArtists(text,catalog.artists,function(_node){
                console.log(_node);
                if(!_node.finished)
                    mainMod.seArtists.push(_node);
                else
                   finishedCounter++;
            });
          },0);

          var inter = setInterval(function(){
              if(finishedCounter >= 2){
                clearInterval(inter);
                if((mainMod.seArtists().length + mainMod.seAlbums().length + mainMod.seSongs().length) === 0){
                  var msg = {type:"danger",
                            title: locale.trans("se_notFound_title"),
                            msg:   locale.trans("se_notFound_msg",{"criteria":text})};
                   koMods["main"].displayGetMessage(msg);
                   koMods["main"].back2MainModel();
                }
              }
          },100);
    };

    mainMod.goArtAlbList = function(art){
      // koMods["main"].back2MainModel();
      // koMods["main"].fillAlbums(art);
      koMods["main"].openSongListModel(art, true);
    };

    mainMod.displaySongs4Album = function(alb){
         koMods["main"].openSongListModel(alb);
    };

    mainMod.addSongToQueue = function(sng){
      if(koMods["songList"])
        koMods["songList"].addItem(sng);
      else{
          koMods["main"].loadSongListModel(function(){
               koMods["songList"].addItem(sng);
          });
      }
    };

//Private functions
   var searchArtists = function(text, artArr, callback){
       artArr.forEach(function(artNode,idx){
            var name = ((artNode.name).toLowerCase()).replace(/\s/ig,"");
            if(name.indexOf(text) !== -1)
                callback(artNode);
       });
       callback({finished:true});
   };

   var searchAlbums = function(text, albArr, callback){
       for(var artId in albArr){
          for(var i in albArr[artId]){
             var albNode = albArr[artId][i];
             var name = ((albNode.name).toLowerCase()).replace(/\s/ig,"");
             if(name.indexOf(text) !== -1)
                 callback(albNode);
          }
       }
     callback({finished:true});
   };

   var searchSongs = function(text, sgnArr, callback){
       for(var albId in sgnArr){
          for(var i in sgnArr[albId]){
             var sngNode = sgnArr[albId][i];
             var name = ((sngNode.name).toLowerCase()).replace(/\s/ig,"");
             if(name.indexOf(text) !== -1)
                 callback(sngNode);
          }
       }
     callback({finished:true});
   };

   var searchAlbAndSongsOnCatalog = function(text, callback){
     koMods["main"].openLoading();
     var catid = koMods["main"].barLoaded().idcatalog;
     window.wutzAdmin.callService({service:"searchOnCatalog/"+catid+"/"+text},function(_res){
           koMods["main"].closeLoading();
           callback(_res);
     });
   };

}
