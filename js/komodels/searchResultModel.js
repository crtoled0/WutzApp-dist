function SearchResultModel(){var o=this;o.seArtists=ko.observableArray([]),o.seAlbums=ko.observableArray([]),o.seSongs=ko.observableArray([]),o.init=function(){console.log("SearchResultModel Loaded")},o.applySearch=function(i){console.log("Searching ... "+i),koMods.main.openLoading();var i=i.toLowerCase().replace(/\s/gi,""),a=wtzCache.getBarCachedCatalog();o.seArtists([]),o.seAlbums([]),o.seSongs([]);var t=0;setTimeout(function(){s(i,a.songs,function(e){console.log(e),e.finished?t++:o.seSongs.push(e)})},0),setTimeout(function(){n(i,a.albums,function(e){console.log(e),e.finished?t++:o.seAlbums.push(e)})},0),setTimeout(function(){e(i,a.artists,function(e){console.log(e),e.finished?t++:o.seArtists.push(e)})},0);var r=setInterval(function(){if(t>=3&&(clearInterval(r),koMods.main.closeLoading(),o.seArtists().length+o.seAlbums().length+o.seSongs().length===0)){var e={type:"danger",title:locale.trans("se_notFound_title"),msg:locale.trans("se_notFound_msg",{criteria:i})};koMods.main.displayGetMessage(e),koMods.main.back2MainModel()}},100)},o.goArtAlbList=function(o){koMods.main.back2MainModel(),koMods.main.fillAlbums(o)},o.displaySongs4Album=function(o){koMods.main.openSongListModel(o)},o.addSongToQueue=function(o){koMods.songList.addItem(o)};var e=function(o,e,n){e.forEach(function(e,s){-1!==e.name.toLowerCase().replace(/\s/gi,"").indexOf(o)&&n(e)}),n({finished:!0})},n=function(o,e,n){for(var s in e)for(var i in e[s]){var a=e[s][i],t=a.name.toLowerCase().replace(/\s/gi,"");-1!==t.indexOf(o)&&n(a)}n({finished:!0})},s=function(o,e,n){for(var s in e)for(var i in e[s]){var a=e[s][i],t=a.name.toLowerCase().replace(/\s/gi,"");-1!==t.indexOf(o)&&n(a)}n({finished:!0})}}