/*
 * Copyright (c) 2016, CRTOLEDO
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */


;(function(window, document, undefined){
	"use strict";

	/**
	 * The actual constructor of the Global object
	 */
	var WutzCacheImpl = {
	    _version : 0.2,
	    _config : {
					defaultLang : 'en'
	    },
      _cacheOnMemory : {},
      _barInSession : "",
			_tempImages : [],
      loadBarCachedInfo : function(barId, catId, catVer , callback){
               var thisMod = this;
               thisMod._barInSession = barId;
               var barCached = thisMod._cacheOnMemory[barId];
               if(!barCached){
                   barCached = JSON.parse(window.localStorage.getItem(barId));
                   if(barCached)
                       thisMod._cacheOnMemory[barId] = barCached;
                   else{
                       thisMod.createNewBar(catId, catVer);
                       barCached = thisMod._cacheOnMemory[barId];
                   }
               }
               if(barCached.catId === catId && barCached.catVers === catVer){
                   if(callback)
                        callback(barCached);
               }
               else{
                   removeBarFromCache(barId, barCached.catId, function(){
                       thisMod._cacheOnMemory[barId] = {"catId":catId,"catVers":catVer};
                       if(callback)
                        callback({newbar:true});
                   });
               }
      },
      setBarIdInSession : function(barId){
                var thisMod = this;
                thisMod._barInSession = barId;
      },
      getBarIdInSession : function(){
                var thisMod = this;
                return thisMod._barInSession;
      },
      createNewBar : function(catId,catVer){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                var barObj = {"catId":catId,"catVers":catVer};
               // barObj[currBarId] = ;
                thisMod._cacheOnMemory[currBarId] = barObj;
                window.localStorage.setItem(currBarId, JSON.stringify(barObj));
      },
      addArtists : function(artsList){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                if(thisMod._cacheOnMemory[currBarId].artists === undefined){
                    thisMod._cacheOnMemory[currBarId].artists = artsList;
                    window.localStorage.setItem(currBarId, JSON.stringify(thisMod._cacheOnMemory[currBarId]));
                }
      },
      addAlbums : function(artistId, albumList){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                var flagAdd = false;
                if(thisMod._cacheOnMemory[currBarId].albums === undefined){
                    thisMod._cacheOnMemory[currBarId].albums = {};
                    flagAdd = true;
                }
                else if(thisMod._cacheOnMemory[currBarId].albums[artistId] === undefined){
                    flagAdd = true;
                }
                if(flagAdd){
                    thisMod._cacheOnMemory[currBarId].albums[artistId] = albumList;
                    window.localStorage.setItem(currBarId, JSON.stringify(thisMod._cacheOnMemory[currBarId]));
                }
      },
      addSongs : function(albumId, songList){
               var thisMod = this;
                var currBarId = thisMod._barInSession;
                if(!thisMod._cacheOnMemory[currBarId].songs){
                    thisMod._cacheOnMemory[currBarId].songs = {};
                }
                thisMod._cacheOnMemory[currBarId].songs[albumId] = songList;
                localStorage.setItem(currBarId, JSON.stringify(thisMod._cacheOnMemory[currBarId]));
      },
      getArtists : function(){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                return thisMod._cacheOnMemory[currBarId].artists;
      },
      getAlbums : function(artistId){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                if(thisMod._cacheOnMemory[currBarId].albums)
                    return thisMod._cacheOnMemory[currBarId].albums[artistId];
                else
                    return undefined;
      },
      getSongs : function(albumId){
                var thisMod = this;
                var currBarId = thisMod._barInSession;
                if(thisMod._cacheOnMemory[currBarId].songs)
                    return thisMod._cacheOnMemory[currBarId].songs[albumId];
                else
                    return undefined;
      },
			getBarCachedCatalog : function(){
				var thisMod = this;
				var currBarId = thisMod._barInSession;
				return thisMod._cacheOnMemory[currBarId];
			},
			startIndexingCatalog : function(){
				var thisMod = this;
				var currBarId = thisMod._barInSession;
				var artists = thisMod._cacheOnMemory[currBarId].artists;
				var total = artists.length;
				var sofar = 0;
				var i = 0;
					//for(var i in artists){
				 var artInter = setInterval(function(){
					 thisMod.indexArtist(artists[i],function(){
							sofar++;
							console.log(sofar);
					 });
					 i++;
					 if(i >= total){
						   clearInterval(artInter);
 							 preloadImages(thisMod._tempImages);
							 thisMod.catchAllSongs();
					  }
				 },100);
			},
			indexArtist : function(art, callback){
				var thisMod = this;
				var currBarId = thisMod._barInSession;
				var albums = thisMod.getAlbums(art.idartist)?thisMod.getAlbums(art.idartist):[];
				console.log("Indexing "+art.idartist);
				if(albums.length === 0){
						window.wutzAdmin.callService({service:"getAlbumPerArtist/"+thisMod._cacheOnMemory[currBarId].catId+"/"+art.idartist},function(_res){
									for(var i in _res){
										_res[i].lfm_img_url = _res[i].lfm_img_url?_res[i].lfm_img_url:"./img/logo.png";
										thisMod._tempImages.push(_res[i].lfm_img_url);
										_res[i]["idartist"] = art.idartist;
										albums.push(_res[i]);
										justAlbums.push(_res[i]);
									}
									thisMod.addAlbums(art.idartist, albums);
									callback();
						});
				}
				else{
					for(var i in albums){
						  thisMod._tempImages.push(albums[i].lfm_img_url);
					}
					callback();
				}
			},
  		catchAllSongs: function(){
						var thisMod = this;
						var currBarId = thisMod._barInSession;
						var catId = thisMod._cacheOnMemory[currBarId].catId;
						var total  = justAlbums.length;
						var i = 0;
						var indexedCount = 0;
						var inter = setInterval(function(){
								thisMod.indexAlbumSongs(justAlbums[i], catId,function(){
									  indexedCount++;
										if(indexedCount >= total){
											thisMod._cacheOnMemory[currBarId]["indexed"] = true;
											console.log(currBarId + ": Indexed ");
										}
								});
								i++;
							 if(i >= total)
							 		clearInterval(inter);
						},100);
				},
				indexAlbumSongs : function(alb,catId ,callback){
					var thisMod = this;
					console.log("Caching Song Album "+alb.name);
					var songs = thisMod.getSongs(alb.idalbum)?thisMod.getSongs(alb.idalbum):[];
					if(songs.length === 0){
						getAlbumSongsFromServer(alb.idalbum,catId,function(_albId,_sngArr){
							thisMod.addSongs(_albId, _sngArr);
							callback();
						});
					}
					else
						callback();

				},
				onCatalogIndexed: function(callback){
					    var thisMod = this;
							var currBarId = thisMod._barInSession;
							var inter = setInterval(function(){
										if(thisMod._cacheOnMemory[currBarId].indexed){
												clearInterval(inter);
												callback();
										}
							},100);
				}
	};

        //Private functions
				var justAlbums = [];

        var removeBarFromCache = function(barId, catId, callback){
            localStorage.removeItem(barId);
            var curBarKeys = localStorage.getItem("tokenCache");
						if(curBarKeys){
            	delete curBarKeys[barId];
            	localStorage.setItem("tokenCache",curBarKeys);
							//currCatKey
							delete WutzCacheImpl._cacheOnMemory[barId];
					  }
            if(callback !== undefined)
                callback();
        };

				var preloadImages = function(imgList){
					var tempPlist = {};
					var i = 0;
					var total = imgList.length;
					//for(var i in imgList){
					var inter = setInterval(function(){
						if(!tempPlist[imgList[i]]){
							 console.log("Loading "+imgList[i]);
							 tempPlist[imgList[i]] = new Image();
							 tempPlist[imgList[i]].src = imgList[i];
						}
						i++;
						if(i >= total)
						   clearInterval(inter);
					},100);
				};

				var getAlbumSongsFromServer = function(albId, catId, callback){
					window.wutzAdmin.callService({service:"getSongsPerAlbum/"+catId+"/"+albId},function(_res){
								callback(albId, JSON.parse(JSON.stringify(_res)));
					});
				};


	var WutzCache = function(){};
	WutzCache.prototype = WutzCacheImpl;
	WutzCache = new WutzCache();
	window.wtzCache = WutzCache;
})(window, document);
