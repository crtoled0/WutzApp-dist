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
          koMods["main"].openLoading();
          var text = (text.toLowerCase()).replace(/\s/ig,"");
          var catalog = wtzCache.getBarCachedCatalog();
          mainMod.seArtists([]);
          mainMod.seAlbums([]);
          mainMod.seSongs([]);
          var finishedCounter = 0;
          setTimeout(function(){
            searchSongs(text,catalog.songs,function(_node){
                console.log(_node);
                if(!_node.finished)
                    mainMod.seSongs.push(_node);
                else
                   finishedCounter++;
            });
          },0);
          setTimeout(function(){
            searchAlbums(text,catalog.albums,function(_node){
                console.log(_node);
                if(!_node.finished)
                    mainMod.seAlbums.push(_node);
                else
                    finishedCounter++;
            });
          },0);
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
              if(finishedCounter >= 3){
                clearInterval(inter);
                koMods["main"].closeLoading();
              }
          },100);
    };

    mainMod.goArtAlbList = function(art){
       koMods["main"].back2MainModel();
       koMods["main"].fillAlbums(art);
    };

    mainMod.displaySongs4Album = function(alb){
         koMods["main"].openSongListModel(alb);
    };

    mainMod.addSongToQueue = function(sng){
        koMods["songList"].addItem(sng);
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

}
