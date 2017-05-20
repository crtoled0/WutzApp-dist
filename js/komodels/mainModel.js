function MainModel() {
    var mainMod = this;
//Private
    var randColours = {idx:0,colours:["success","default","primary","danger","warning","info"]};
//Public
    mainMod.barLoaded = ko.observable();
    mainMod.config = ko.observable();
    mainMod.artists = ko.observableArray([]);
    mainMod.albums = ko.observableArray([]);
    mainMod.currSelected = ko.observable({artist:null,
                                          album:null});
    mainMod.getMessBox = ko.observable();
    mainMod.isSearchIndexing = ko.observable(false);
    mainMod.displayMainMod = ko.observable(true);
    mainMod.canRaiseSearch = ko.observable(false);

    mainMod.trans = function(attr,parm){
          if(!parm)
            return locale.trans(attr);
          else
            return locale.trans(attr, parm);
    };

    mainMod.displayGetMessage = function(msg){
          mainMod.getMessBox(msg);
          $("#genericMessageBox").fadeIn(300).delay(3000).fadeOut(500);
    };

    mainMod.nextColor = function(){
            var toSend = randColours.colours[randColours.idx];
            randColours.idx++;
            if(randColours.idx >= (randColours.colours.length-1))
                randColours.idx = 0;
            return toSend;
    };

    mainMod.fillAlbums = function(art){
      mainMod.albums([]);
      var barLoaded = mainMod.barLoaded();
      var sel = mainMod.currSelected();
      sel.artist = art;
      mainMod.currSelected(sel);

      var cacheAlbums = wtzCache.getAlbums(art.idartist);
      if(!cacheAlbums){
            mainMod.openLoading();
            window.wutzAdmin.callService({service:"getAlbumPerArtist/"+barLoaded.idcatalog+"/"+art.idartist},function(_res){
                  mainMod.closeLoading();
                  console.log(_res);
                  for(var i in _res){
                    _res[i].lfm_img_url = _res[i].lfm_img_url?_res[i].lfm_img_url:"./img/logo.png";
                    mainMod.albums.push(_res[i]);
                  }
                  wtzCache.addAlbums(art.idartist, mainMod.albums());
            });
      }
      else
         mainMod.albums(cacheAlbums);
      $("#main-container-image .artists").slideUp(function(){
        $("#main-container-image .albums").slideDown();
        $("#main-container-image .closeAlbumsSec").slideDown();
      });
    };

    mainMod.closeAlbums = function(){
      $("#main-container-image .artists").slideDown();
      $("#main-container-image .albums").slideUp();
      $("#main-container-image .closeAlbumsSec").slideUp();
    };

    mainMod.fillArtists = function(){
      mainMod.artists([]);
      var barLoaded = mainMod.barLoaded();
      var cacheArtists = wtzCache.getArtists();
      if(!cacheArtists){
          mainMod.openLoading();
          window.wutzAdmin.callService({service:"getArtistList/"+barLoaded.idcatalog},function(_res){
                mainMod.closeLoading();
    //            value.lfm_img_url = value.lfm_img_url?value.lfm_img_url:"./img/logo64x64.png";
                console.log(_res);
                for(var i in _res){
                  _res[i].lfm_img_url = _res[i].lfm_img_url?_res[i].lfm_img_url:"./img/logo.png";
                  mainMod.artists.push(_res[i]);
                }
                wtzCache.addArtists(mainMod.artists());
                mainMod.isSearchIndexing(true);
                setTimeout(function(){
                    wtzCache.startIndexingCatalog();
                },0);
                wtzCache.onCatalogIndexed(function(){
                    mainMod.isSearchIndexing(false);
                });
          });
      }
      else
        mainMod.artists(cacheArtists);
    };
     mainMod.init = function(){
       mainMod.openLoading();
       if(!mainMod.barLoaded()){
         $.get( "json/config.json", function(_config) {
            console.log(_config);
              mainMod.config(_config);
              mainMod.openConnect2BarModel();
              mainMod.closeLoading();
          });
        }
        $('#filterInput').on('keyup', function(){
          setTimeout(function(){
            mainMod.localSearch($('#filterInput').val());
          },0);
        });
     };

    //Functions To Start Externam Models
    mainMod.openConnect2BarModel = function(){
    //  $("#stripes").click();
      mainMod.openLoading();
      if(!koMods["connect2Bar"]){
        $.get('templates/connect2Bar.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("body").append(midtUpObj);
            koMods["connect2Bar"] = new Connect2BarModel();
            ko.applyBindings(koMods["connect2Bar"], document.getElementById("connect2BarContainer"));
        //    locale.transHtmlSection($("#connect2BarContainer"));
            koMods["connect2Bar"].init();
            $('#connect2BarContainer').modal({backdrop: 'static', keyboard: false});
            mainMod.closeLoading();
        });
      }
      else{
         $('#connect2BarContainer').modal({backdrop: 'static', keyboard: false});
         mainMod.closeLoading();
      }
    };

    mainMod.openConnect2Bar = function(){
        mainMod.openConnect2BarModel();
        koMods["connect2Bar"].justDisplayBarDetails();
        $("#cross-menu").click();
    };

    mainMod.openSongListModel = function(alb){
    //  $("#stripes").click();
      mainMod.openLoading();
      var sel = mainMod.currSelected();
      sel.album = alb;
      mainMod.currSelected(sel);
      if(!koMods["songList"]){
        $.get('templates/songList.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("body").append(midtUpObj);
            koMods["songList"] = new SongListModel();
            ko.applyBindings(koMods["songList"], document.getElementById("songListContainer"));
          //  locale.transHtmlSection($("#songListContainer"));
            koMods["songList"].init();
            koMods["songList"].loadSongList();
            $('#songListContainer').modal({backdrop: 'static', keyboard: false});
            mainMod.closeLoading();
        });
      }
      else{
        koMods["songList"].loadSongList();
         $('#songListContainer').modal({backdrop: 'static', keyboard: false});
         mainMod.closeLoading();
      }
    };

    mainMod.openSearchResultModel = function(){
    //  $("#stripes").click();
      var text = $("#filterInput").val();
      mainMod.openLoading();
      mainMod.displayMainMod(false);
      if(!koMods["searchResult"]){
        $.get('templates/searchResult.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("#main-container-image").parent().append(midtUpObj);
            koMods["searchResult"] = new SearchResultModel();
            ko.applyBindings(koMods["searchResult"], document.getElementById("searchResultContainer"));
          //  locale.transHtmlSection($("#searchResultContainer"));
            koMods["searchResult"].init();
            koMods["searchResult"].applySearch(text);
          //  $('#searchResultContainer').modal({backdrop: 'static', keyboard: false});
            $("#main-container-image").fadeOut("slow");
            $("#searchResultContainer").fadeIn("slow");
            mainMod.closeLoading();
        });
      }
      else{
        koMods["searchResult"].applySearch(text);
        $("#main-container-image").fadeOut("slow");
        $("#searchResultContainer").fadeIn("slow");
         mainMod.closeLoading();
      }
    };

    mainMod.back2MainModel = function(){
      $("#main-container-image").fadeIn("slow");
      $("#searchResultContainer").fadeOut("slow");

    //  mainMod.closeAlbums();
      mainMod.displayMainMod(true);
    //  mainMod.fillArtists();
      $('#filterInput').on('keyup', function(){
        setTimeout(function(){
          mainMod.localSearch($('#filterInput').val());
        },0);
      });
      mainMod.localSearch($('#filterInput').val());
    };

    mainMod.logOutBar = function(){
       $("#cross-menu").click();
       mainMod.barLoaded(null);
       mainMod.artists([]);
       mainMod.albums([]);
       mainMod.openConnect2BarModel();
       koMods["connect2Bar"].refresh();
    };

    mainMod.openLoading = function(){
      $("#loadingDiv").fadeIn("slow");
    };

    mainMod.closeLoading = function(){
      $("#loadingDiv").fadeOut("slow");
    };

    mainMod.localSearch = function(text){
       var text = (text.toLowerCase()).replace(/\s/ig,"");
       if(text === ""){
          $(".work figure").show();
          mainMod.canRaiseSearch(false);
        }
       else if(text.length >= 2){
          mainMod.canRaiseSearch(true);
          $(".work figure").hide();
          $(".work figure").each(function(val){
            // console.log($(".itemName",$(this)).html());
             var itmName = (($(".itemName",$(this)).html()).toLowerCase()).replace(/\s/ig,"");
             if(itmName.indexOf(text) !== -1)
                 $(this).show();

             if($("#main-container-image .albums figure").length - $("#main-container-image .albums figure:hidden").length <= 0){
                mainMod.closeAlbums();
             }
             else{
               $("#main-container-image .artists").hide();
               $("#main-container-image .albums").show();
               $("#main-container-image .closeAlbumsSec").show();
             }
          });
        }
    };

    mainMod.openMainMenu = function(){
       $("#main-container-menu").stop().animate({left:'0'},300);
    };
    mainMod.closeMainMenu = function(){
       $("#main-container-menu").stop().animate({'left':'-100%'},300);
    };
}
var koMods = {};
