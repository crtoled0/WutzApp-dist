function MainModel() {
    var mainMod = this;
//Private
    var randColours = {idx:0,colours:["success","default","primary","danger","warning","info"]};
    var albModOpened = false;
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

    mainMod.credits = ko.observable(0);


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
    var firstAlbumOpened = true;
    mainMod.fillAlbums = function(art){
    //  $(".work figure .btn").css("height",$(".work figure a img:last").css("height")); // To Set up button height
    //  $(".work figure .btn").css("height",$(".work figure").height());
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
      else{
         mainMod.albums(cacheAlbums);
      }
      albModOpened = true;
      $('#albumListModal').appendTo("body").modal({backdrop: 'static', keyboard: false});
      $('#albumListModal').on('shown.bs.modal', function () {
        if(firstAlbumOpened){
           $(".work figure .btn").css("height",$(".work #sizer").height());
           $(".work #sizer").hide();
           firstAlbumOpened = false;
        }
      });
    };

    mainMod.openPendingAlbums = function(){
      /**
        if(albModOpened){
          $(document).on('hidden.bs.modal','#songListContainer', function () {
              console.log("#songListContainer Closed");
              //$('#albumListModal').modal("hide");
              $('#albumListModal').appendTo("body").modal({backdrop: 'static', keyboard: false});
          });
        }
        **/
    };

    mainMod.closeAlbums = function(){
       albModOpened = false;
      //$("#main-container-image .artists").slideDown();
      //$("#main-container-image .albums").slideUp();
      //$("#main-container-image .closeAlbumsSec").slideUp();
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
                for(var i in _res){
                  _res[i].lfm_img_url = _res[i].lfm_img_url?_res[i].lfm_img_url:"./img/logo.png";
                  mainMod.artists.push(_res[i]);
                }
                wtzCache.addArtists(mainMod.artists());
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
        mainMod.loadPlayListModel();
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

    mainMod.openSongListModel = function(itm, artistLst){
    //  $("#stripes").click();
     var alb = !artistLst?itm:null;
     var art = artistLst?itm:null;

      mainMod.openLoading();
      if(alb){
        var sel = mainMod.currSelected();
        sel.album = alb;
        mainMod.currSelected(sel);
      }
      if(!koMods["songList"]){
        $.get('templates/songList.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("body").append(midtUpObj);
            koMods["songList"] = new SongListModel();
            ko.applyBindings(koMods["songList"], document.getElementById("songListContainer"));
          //  locale.transHtmlSection($("#songListContainer"));
            koMods["songList"].init();
            if(alb)
                koMods["songList"].loadSongList();
            else
                koMods["songList"].loadSongList4Artist(art.idartist);
            $('#songListContainer').appendTo("body").modal({backdrop: 'static', keyboard: false});
            mainMod.closeLoading();
        });
      }
      else{
        if(alb)
            koMods["songList"].loadSongList();
        else
            koMods["songList"].loadSongList4Artist(art.idartist);

         $('#songListContainer').appendTo("body").modal({backdrop: 'static', keyboard: false});
         mainMod.closeLoading();
      }
    };

    mainMod.loadSongListModel = function(callback){
      mainMod.openLoading();
      if(!koMods["songList"]){
        $.get('templates/songList.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("body").append(midtUpObj);
            koMods["songList"] = new SongListModel();
            ko.applyBindings(koMods["songList"], document.getElementById("songListContainer"));
            koMods["songList"].init();
            mainMod.closeLoading();
            callback();
        });
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
      mainMod.displayMainMod(true);
    };

    mainMod.loadPlayListModel = function(callback){
      mainMod.openLoading();
      if(!koMods["playList"]){
        $.get('templates/playList.html', function(htmlTlp) {
            var midtUpObj = $("<div>"+htmlTlp+"</div>");
            $("body").append(midtUpObj);
            koMods["playList"] = new PlayListModel();
            ko.applyBindings(koMods["playList"], document.getElementById("playListContainer"));
            koMods["playList"].init();
            mainMod.closeLoading();
            if(callback)
                callback();
        });
      }
    };

    mainMod.viewCurrentPlayList = function(){
        koMods["playList"].loadCurrentPlayList(function(){
            $("#cross-menu").click();
            $('#playListContainer').modal({backdrop: 'static', keyboard: false});
        });
    }

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

            /**
             if($("#main-container-image .albums figure").length - $("#main-container-image .albums figure:hidden").length <= 0){
                mainMod.closeAlbums();
             }
             else{
               $("#main-container-image .artists").hide();
               $("#main-container-image .albums").show();
               $("#main-container-image .closeAlbumsSec").show();
             }
             **/
          });
        }
    };

    mainMod.openMainMenu = function(){
       $("#main-container-menu").stop().animate({left:'0'},300);
    };
    mainMod.closeMainMenu = function(){
       $("#main-container-menu").stop().animate({'left':'-100%'},300);
    };

    mainMod.refreshCredits = function(){
      var barL = mainMod.barLoaded();
      var _guid = window.localStorage.getItem("guid");
      var _parms = {catId:barL.idcatalog,
                    guid:_guid};
      var currCredits = mainMod.credits();
      wutzAdmin.callService({service:"checkCredits",method:"POST",params:_parms},function(_res){
        if(_res.OK){
          if(currCredits < _res.totalCredits){
              var msg = {type:"success",
                        title:locale.trans("ok"),
                        msg: locale.trans("added_credits",{"CRED_ADDED":(_res.totalCredits-currCredits)})};
              mainMod.displayGetMessage(msg);
          }
          console.log(JSON.stringify(_res));
          mainMod.credits(_res.totalCredits);
        }
      });
    };

    mainMod.collectCreditsFromTransfer = function(_barMsg,callback){
      var barL = mainMod.barLoaded();
      var _guid = window.localStorage.getItem("guid");
      var _parms = {catId:barL.idcatalog,
                    guidto:_guid,
                    tranCode: _barMsg.transferCode};
      mainMod.linkDevice2Bar(_barMsg.dayToken,function(){
          wutzAdmin.callService({service:"transferCredits",method:"POST",params:_parms},function(_res){
            console.log("back from transfer "+JSON.stringify(_res));
              if(_res.OK)
                 mainMod.refreshCredits();
              callback(_res);
          });
      });
    };

    mainMod.linkDevice2Bar = function(_dayToken,callback){
      var barL = mainMod.barLoaded();
      var _guid = window.localStorage.getItem("guid");
      var _parms = {catId:barL.idcatalog,
                    guid:_guid,
                    token: _dayToken};

      JSON.stringify(_parms);

      wutzAdmin.callService({service:"connect2Bar",method:"POST",params:_parms},callback);
    };


    mainMod.catchFromQR = function(){
      cordova.plugins.barcodeScanner.scan(
         function (result) {
           //{barId: mainMod.barDet().id,dayToken:mainMod.barDet().dayToken,transferCode:_res.transfCode}
            if(result.text){
             var _msg = JSON.parse(result.text);
             var connect2Bar = !mainMod.barLoaded() || !mainMod.barLoaded().connected || mainMod.barLoaded().id !== _msg.barId;
             if(connect2Bar){
                   console.log(JSON.stringify(_msg));
                   koMods["connect2Bar"].showBarDetails({id:_msg.barId},function(){
                       $("#inputTokenBar input").val(_msg.dayToken);
                       koMods["connect2Bar"].connect2Bar(null,function(){
                         if(_msg.transferCode){
                           mainMod.collectCreditsFromTransfer(_msg, function(_res){
                             console.log(_res);
                             $("#cross-menu").click();
                           });
                         }
                       });
                   });
             }
             else if(_msg.transferCode){
               mainMod.collectCreditsFromTransfer(_msg, function(_res){
                 console.log(JSON.stringify(_res));
                 $("#cross-menu").click();
               });
             }
           }
          /**
             alert("We got a barcode\n" +
                   "Result: " + result.text + "\n" +
                   "Format: " + result.format + "\n" +
                   "Cancelled: " + result.cancelled);
                   **/
         },
         function (error) {
             alert("Scanning failed: " + error);
         });
    };
}
var koMods = {};
