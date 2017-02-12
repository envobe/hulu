$(document).ready(function(){
    var homeevent = function(){
        var load_next_page = function(){
            if ($(".content.home .items .pagination .next-page").length > 0) {
                $(".content.home>.items>.item").last().css({"border": "none"});     //去掉末行底部边框
                $(".content.home .items .pagination .current").hide();
                $(".content.home .items .pagination .previous-page").hide();
                $(".content.home .items .pagination .next-page").text(($('html').attr('lang') == "zh")?"加载更多":"Load More");
                //$(".content.home .items .pagination .next-page").css({"width": "100%", "height":"30px"});
                var loadstatus = 0;
                $(".content.home .items .pagination .next-page").click(function(){
                    if (loadstatus == 1) {
                        return false;
                    } else {
                        loadstatus = 1;
                    }
                    var url = $(this).attr("href");
                    $(".content.home .items .pagination .next-page").text(($('html').attr('lang') == "zh")?"加载中…":"loading...");
                    $(".content.home .items .pagination .next-page").attr("disabled", true);
                    $(".content.home .items .pagination .current").load(url + " .items", function(){
                        //去掉页数超限情况下的重复项
                        $(".content.home>.items .pagination .current .items .item").each(function(){
                            var thus = $(this);
                            var itemlink = thus.find("a.item-title").attr("href");
                            $(".content.home>.items>.item").each(function(){
                                if (itemlink == $(this).find("a.item-title").attr("href")) {
                                    thus.remove();
                                    return true;
                                }
                            });
                        });

                        $(".content.home>.items>.item").last().css({"border-bottom": "1px solid whitesmoke"});      //还原末行底部边框
                        $(".content.home>.items>.pagination").after($(".content.home>.items>.pagination .current .items").html());
                        $(".content.home>.items>.pagination").first().remove();
                        $("a").unbind("click");
                        ajaxget($("a"));
                        load_next_page();
                    });
                    return false;
                });
            } else {
                $(".content.home .items .pagination").remove();
            }
        }
        load_next_page();
        var loading = function(){
            if($(".loading").length <= 0){
                $(".loading").remove();
                $(".content-header").append("<p class=\"loading\" style=\"color:gray;text-align:center;display:none;\">" + ($('html').attr('lang') == "zh")?"加载中…":"loading..." + "</p>");
                $(".loading").slideDown();
            }
            $(".content.home").load("/ .items", function(response, status, xhr){
                $(".items").show();
                $("a").unbind("click");
                ajaxget($("a"));
                load_next_page();
                $(".loading").slideUp(function(){
                    $(this).remove();
                });
            });
            $.getJSON("/u/notify/?type=json", function(json){
                if(json.status == "success"){
                    if(json.notify.count != 0){
                        if ($(".notify-amount").length > 0){
                            $(".notify-amount").text(json.notify.count);
                            $(".notify-amount").addClass("notify-amount-new");
                        } else {
                            $(".header .right-navbar .accounts-button").after(" <a href=\"/u/notify/\" class=\"notify-amount notify-amount-new\">" + json.notify.count + "</a>");
                        }
                    } else {
                        $(".notify-amount").text(json.notify.count);
                        $(".notify-amount").removeClass("notify-amount-new");
                    }
                }
            });
        }
        /*$(".header .logo").click(function(){
            $(window).scrollTop(0);
            loading();
            return false;
        });*/
        /*
        var b = document.getElementsByClassName("container")[0];
        var x,y,scrollTop;
        var isTouch,isPullDown=false,isPullUp=false;

        b.addEventListener("touchstart", function(evt){
            var touch = evt.touches[0]; //获取第一个触点
            //x = Number(touch.pageX); //页面触点X坐标
            y = Number(touch.pageY); //页面触点Y坐标
            scrollTop=b.scrollTop;
            isTouch=true;
        });
        b.addEventListener("touchend", function(evt){
            isTouch=false;
            isPullDown=false;
            isPullUp=false;
        });
        b.addEventListener("touchmove", function(evt){
            var touch = evt.touches[0]; //获取第一个触点
            //var mx = Number(touch.pageX); //页面触点X坐标
            var my = Number(touch.pageY); //页面触点Y坐标

            if(isTouch){
                if(my - y > 120){
                    if(b.scrollTop==0){
                        if(!isPullUp){
                            isPullUp=true;
                            loading();
                        }
                    }
                }
                //if( y-my > 100 ){
                //    if(scrollTop!=0 && scrollTop == b.scrollTop){
                //        if(!isPullDown){
                //            isPullDown=true;
                //        }
                //    }
                //}
            }
        });
        */
    }

    var itemviewevent = function(){
        if ($(".right-navbar .accounts-button").length > 0){
            $(".comment .comment-operate .comment-reply").click(function(){
                $(".comment .comment-operate .cancel-comment-reply").each(function(){
                    $(this).closest(".comment .comment-operate").find(".comment-reply").show();
                    $(this).remove();
                    return false;
                });

                $(".comment-form .comment-parent").val($(this).closest(".comment").attr("id"));
                $(".comment-form .comment-reply-to-users").remove();
                $(".comment-form .comment-content").prepend("<div class=\"comment-reply-to-users\">"+ ($('html').attr('lang') == "zh")?"回复":"Reply to" + " <a class=\"comment-reply-to-user\">" + $(this).closest(".comment").find(".item-info .comment-author span.username").text() + "</a></div>");
                $(this).hide();
                $(this).after("<a class=\"cancel-comment-reply\" href=\"\">" + ($('html').attr('lang') == "zh")?"取消回复":"Cancel" + "</a>");
                $(".comment-form").appendTo($(this).closest(".comment"));
                $(".comment .comment-operate .cancel-comment-reply").click(function(){
                    $(".comment-form .comment-parent").val("");
                    $(".comment-form .comment-content .comment-reply-to-users").remove();
                    $(this).closest(".comment .comment-operate").find(".comment-reply").show();
                    $(this).remove();
                    $(".comment-form").appendTo(".content");
                    return false;
                });
                $(".comment-form textarea").focus();
                return false;
            });

            $(".updateitem-btn").click(function(){
                $(".updateitemform").show();
                $(".updateitemform textarea").focus();
                $(".updateitem-btn").hide();
                return false;
            });
            $(".updateitemform .cancel-btn a").click(function(){
                $(".updateitem-btn").show();
                $(".updateitemform").hide();
                return false;
            });

            var removetag = function(tagdom){
                var itemtag = $(this);
                $.ajax({
                    type: "post",
                    data: {
                        //"csrfmiddlewaretoken": "{{ csrf_token }}",
                        "csrfmiddlewaretoken": $("form.additemtag").find("input").first().val(),
                        "tagname": $(this).text(),
                        "operate": "remove"
                    },
                    success: function(){
                        itemtag.remove();
                    }
                });
                return false;
            };
            $(".updatetag-btn").click(function(){
                if ($(".additemtagform").is(":visible")) {
                    $(".additemtagform").hide();
                    $(this).text(($('html').attr('lang') == "zh")?"编辑话题":"Edit Tags");
                    $(".item-head .item-tags .item-tag a").each(function(){
                        $(this).unbind("click");
                        ajaxget($(this));
                    });
                } else {
                    $(".additemtagform").show();
                    $(this).text(($('html').attr('lang') == "zh")?"保存话题":"Save Tags");
                    $(".item-head .item-tags .item-tag a").each(function(){
                        $(this).bind("click", removetag);
                    });
                }
                return false;
            });
            $(".additemtag").submit(function(){
                var itemtag = $(this).find(".item-tag-name");
                var itemtaglist = new Array();
                $(".item-head .item-tags .item-tag").each(function(){
                    itemtaglist.push($(this).text());
                });
                if ( itemtag.val().trim() == "" || $.inArray(itemtag.val(), itemtaglist) != -1 ) {
                    itemtag.val("");
                    itemtag.focus();
                    $(".additemtagform .submit").attr("disabled", false);
                    return false;
                } else {
                    $.ajax({
                        type: "post",
                        data: {
                            //"csrfmiddlewaretoken": "{{ csrf_token }}",
                            "csrfmiddlewaretoken": $("form.additemtag").find("input").first().val(),
                            "tagname": itemtag.val(),
                            "type": "json"
                        },
                        success: function(data){
                            $(".item-head .item-tags").append("<div class=\"item-tag\"><a href=\"/t/" + data + "/\">" + itemtag.val() + "</a></div>");
                            $(".item-head .item-tags .item-tag a").last().bind("click", removetag);
                            itemtag.val("");
                            $(".additemtagform .submit").attr("disabled", false);
                        }
                    });
                    return false;
                }
            });
            $(".hideitem-btn").click(function(){
                var thus = $(this);
                var confirm = prompt(($('html').attr('lang') == "zh")?"请输入 YES 以确定：":"Please input YES to comfirm: ", "");
                if (confirm == "YES") {
                    $.ajax({
                        url: "",
                        type: "post",
                        data: {
                            "csrfmiddlewaretoken": "{{ csrf_token }}",
                            "status": "private"
                        },
                        success: function(){
                            thus.remove();
                        }
                    });
                }
                return false;
            });
        }
        $(".content.item .operate").css("visibility", "hidden");
        $(".content.item").mouseover(function(){
            $(this).find(".operate").css("visibility", "visible");
        });
        $(".content.item").mouseout(function(){
            $(this).find(".operate").css("visibility", "hidden");
        });
        $(".comment-operate").css("visibility", "hidden");
        $(".comment-operate").closest(".comment").mouseover(function(){
            $(this).find(".comment-operate").css("visibility", "visible");
        });
        $(".comment-operate").closest(".comment").mouseout(function(){
            $(this).find(".comment-operate").css("visibility", "hidden");
        });
    }

    var tagevent = function(){
        var load_next_page = function(){
            if ($(".content.home .items .pagination .next-page").length > 0) {
                $(".content.home>.items>.item").last().css({"border": "none"});     //去掉末行底部边框
                $(".content.home .items .pagination .current").hide();
                $(".content.home .items .pagination .previous-page").hide();
                $(".content.home .items .pagination .next-page").text(($('html').attr('lang') == "zh")?"加载更多":"Load More");
                //$(".content.home .items .pagination .next-page").css({"width": "100%", "height":"30px"});
                $(".content.home .items .pagination .next-page").click(function(){
                    var url = $(this).attr("href");
                    $(".content.home .items .pagination .next-page").text(($('html').attr('lang') == "zh")?"加载中…":"loading...");
                    $(".content.home .items .pagination .next-page").attr("disabled",true);
                    $(".content.home .items .pagination .current").load(url + " .items", function(){
                        //去掉页数超限情况下的重复项
                        $(".content.home>.items .pagination .current .items .item").each(function(){
                            var thus = $(this);
                            var itemlink = $(this).find(".item-title a").attr("href");
                            $(".content.home>.items>.item").each(function(){
                                if (itemlink == $(this).find(".item-title a").attr("href")) {
                                    thus.remove();
                                    return true;
                                }
                            });
                        });

                        $(".content.home>.items>.item").last().css({"border-bottom": "1px solid whitesmoke"});      //还原末行底部边框
                        $(".content.home>.items .pagination").after($(".content.home>.items .pagination .current .items").html());
                        $(".content.home>.items .pagination").first().remove();
                        load_next_page();
                    });
                    return false;
                });
            } else {
                $(".content.home .items .pagination").remove();
            }
        }
        load_next_page();
    }

    var commonevent = function(){
        $(".itemcontent-content pre, .userprofile pre, .userpage pre").each(function(){
            //$(this).html($(this).html().replace(/((http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-\|]*[\w@?^=%&amp;\/~+#-\|])?)/g, "<a href=\"$1\" target=\"blank\">$1</a>"));
            $(this).html($(this).html().replace(/([a-zA-z]+\:\/\/[^\s]*)/g, "<a href=\"$1\" target=\"blank\">$1</a>"));
        });
        $(".itemcontent-content a, .userprofile .description a, .userpage .description a").each(function(){
            var url = $(this).text();
            var urlitem = $(this);
            $("<img>", {
                src: url
            }).on("load", function() {
                urlitem.after($(this));
                urlitem.remove();
            }).on("error", function() {

            });
        });
        $("form").each(function(){
            $(this).submit(function(){
                $(this).find(".submit").attr("disabled", true);
            });
        });
        var svgresize = function(){
            $("svg").each(function(){
                if ($(this).attr("owidth").split("pt")[0] * 4 / 3 > $(this).parent().width() || $(this).attr("width") > $(this).parent().width() || ($(this).attr("owidth").split("pt")[0] * 3 / 4 > $(this).parent().width() && $(this).attr("width") < $(this).parent().width())) {
                    $(this).attr("height", $(this).parent().width() * ($(this).attr("oheight").split("pt")[0] / $(this).attr("owidth").split("pt")[0]));
                    $(this).attr("width", $(this).parent().width());
                }
            });

            if($(window).width() > 720 && $(".sidebar").height() + 70 > $(window).height()) {
                $(".sidebar").css({"position": "absolute"});
                $(".container").css({"min-height": "calc(100% - " + ($(".header").height() - 46 + $(".footer").height() - $(".sidebar").height() - 70 + $(window).height()) + "px - " + $(".container").css("padding-top") + ")"});
            } else {
                if ($(window).width() > 720) {
                    $(".sidebar").css({"position": "fixed"});
                } else {
                    $(".sidebar").css({"position": "relative"});
                }
                $(".container").css({"min-height": "calc(100% - " + ($(".header").height() - 46 + $(".footer").height()) + "px - " + $(".container").css("padding-top") + ")"});
            }
        }
        $("svg").each(function(){
            $(this).attr("owidth", $(this).attr("width"));
            $(this).attr("oheight", $(this).attr("height"));
        });
        svgresize();
        $(window).resize(function() {
            svgresize();
        });

        $(".itemform .submit").click(function(){
            if($.trim($(this).closest(".itemform").find("textarea").val()) == "") {
                $(this).closest(".itemform").find("textarea").focus();
                return false;
            } else {
                if(window.localStorage){
                    localStorage.removeItem("itemcontent");
                }
            }
        });

        if(window.localStorage){
            var ls = localStorage.getItem("itemcontent");
            if($(".itemform").find("textarea").val() == "" && ls != null && ls != ""){
                $(".itemform").find("textarea").val(ls);
            }
            $(".itemform").find("textarea").on("input propertychange paste change", function(){
                localStorage.setItem("itemcontent", $(".itemform").find("textarea").val());
            });
        }

        if ($('html').attr('lang') == "zh") {
            $(".itemform .submit").parent().before('\
                <div class="fileselect" style="text-align: center;">\
                    <input class="wbimg" type="file" name="file" style="display: none;" />\
                    <input class="fileselectbutton" type="button" value="上传图片" style="font-size: small;" />\
                </div>\
                <div class="process" style="width: 100%; display: none;">\
                    <div class="processbar" style="width: 0%; height: 22px; background: black;"></div>\
                </div>\
                <div class="uploadinfo" style="text-align: center; height: 18px; font-size: small; color: gray;"></div>\
            ');
        } else {
            $(".itemform .submit").parent().before('\
                <div class="fileselect" style="text-align: center;">\
                    <input class="wbimg" type="file" name="file" style="display: none;" />\
                    <input class="fileselectbutton" type="button" value="Upload Image" style="font-size: small;" />\
                </div>\
                <div class="process" style="width: 100%; display: none;">\
                    <div class="processbar" style="width: 0%; height: 22px; background: black;"></div>\
                </div>\
                <div class="uploadinfo" style="text-align: center; height: 18px; font-size: small; color: gray;"></div>\
            ');
        }
        $(".itemform .fileselectbutton").click(function(){
            $(this).closest(".itemform").find(".wbimg").click();
        });
        $(".itemform .wbimg").fileupload({
            url: "/wi/",
            dataType: "jsonp",
            done: function(e, data){
                $(this).prop("disabled", false);
                $(this).next(".fileselectbutton").prop("disabled", false);
                $(this).parent().show();
                $(this).closest(".itemform").find(".submit").prop("disabled", false);
                var wbimgurl = data.result.original_pic;
                if ($(this).closest(".itemform").find("textarea").val() == "") {
                    $(this).closest(".itemform").find("textarea").val(wbimgurl);
                } else {
                    $(this).closest(".itemform").find("textarea").val($(this).closest(".itemform").find("textarea").val() + "\r\n" + wbimgurl);
                }
                $(this).closest(".itemform").find(".process").hide();
                $(this).closest(".itemform").find(".uploadinfo").show();
                if ($('html').attr('lang') == "zh") {
                    $(this).closest(".itemform").find(".uploadinfo").text("上传成功，请备份图片链接。");
                } else {
                    $(this).closest(".itemform").find(".uploadinfo").text("Upload succeeded, please backup the link.");
                }

            },
            fail: function(e, data){
                $(this).prop("disabled", false);
                $(this).next(".fileselectbutton").prop("disabled", false);
                $(this).parent().show();
                $(this).closest(".itemform").find(".submit").prop("disabled", false);
                $(this).closest(".itemform").find(".process").hide();
                $(this).closest(".itemform").find(".uploadinfo").show();
                if ($('html').attr('lang') == "zh") {
                    $(this).closest(".itemform").find(".uploadinfo").text("上传失败，请检查图片后重试。");
                } else {
                    $(this).closest(".itemform").find(".uploadinfo").text("Upload failed, please check and retry.");
                }
            },
            progressall: function(e, data){
                $(this).closest(".itemform").find(".process").show();
                //$(this).closest(".itemform").find(".uploadinfo").hide();
                var process = parseInt(data.loaded / data.total * 100, 10);
                $(this).closest(".itemform").find(".process .processbar").css("width", process + "%");
                $(this).closest(".itemform").find(".uploadinfo").text(process + "%");
            },
            add: function(e, data){
                $(this).prop("disabled", true);
                $(this).next(".fileselectbutton").prop("disabled", true);
                $(this).parent().hide();
                $(this).closest(".itemform").find(".submit").prop("disabled", true);
                //$(this).closest(".itemform").find(".process").hide();
                $(this).closest(".itemform").find(".uploadinfo").show();
                if ($('html').attr('lang') == "zh") {
                    $(this).closest(".itemform").find(".uploadinfo").text("正在上传…");
                } else {
                    $(this).closest(".itemform").find(".uploadinfo").text("uploading...");
                }
                data.submit();
            }
        });

        $(".newtagform").submit(function(){
            var itemtag = $(this).find(".item-tag-name");
            if ( itemtag.val().trim() == "") {
                itemtag.val("");
                itemtag.focus();
                $(".newtagform .submit").attr("disabled", false);
            } else {
                ajaxload($(this).attr("action") + "?t=" + itemtag.val().trim());
            }
            return false;
        });

        $(".search").submit(function(){
            var qstr = $(this).find(".qstr");
            if (qstr.val().trim() == "") {
                qstr.val("");
                qstr.focus();
                return false;
            } else {
                ajaxload("/?q=" + qstr.val().trim());
                return false;
            }
        });

        $(".container").css({"min-height": "calc(100% - " + ($(".header").height() - 46 + $(".footer").height()) + "px - " + $(".container").css("padding-top") + ")"});
        $(".header .search").css({"width": "calc(100% - " + ($(".header .logo").width() + $(".header .right-navbar").width() + 24) + "px)", "margin-right": ($(".header .right-navbar").width() + 16) + "px"});

        //if ($(".right-navbar .accounts-button .avatar img").attr("userid") == "1" ) {
            var addmusicswitch = function(){
                if($(".search .musicswitch").length == 0) {
                    $(".search").append("<a class=\"musicswitch\"></a>");
                    $(".search .musicswitch").css({
                        "font-family": "arial,sans-serif",
                        "color": "white",
                        "background": "green",
                        "font-weight": "bold",
                        "width": "24px",
                        "height": "24px",
                        "line-height": "24px",
                        "border-radius": "12px",
                        "-webkit-border-radius": "12px",
                        "-moz-border-radius": "12px",
                        "text-align": "center",
                        "font-size": "small",
                        "display": "inline-block",
                        "position": "absolute",
                        "right": "-3px",
                        "top": "0px",
                        "cursor": "pointer",
                        "opacity": "0.6",
                        "filter": "alpha(opacity=60)"
                    });
                    $(".search .musicswitch").mouseover(function(){
                        $(this).css({
                            "opacity": "1",
                            "filter": "alpha(opacity=100)"
                        });
                    }).mouseout(function(){
                        $(this).css({
                            "opacity": "0.6",
                            "filter": "alpha(opacity=60)"
                        });
                    });

                    var getplaystatus = function(){
                        if($(".musicplayer audio")[0].paused){
                            $(".search .musicswitch").text("开");
                        } else {
                            $(".search .musicswitch").text("关");
                        }
                        setTimeout(getplaystatus, 1000);
                    }
                    getplaystatus();

                    $(".search .musicswitch").click(function(){
                        if($(this).text() == "关"){
                            $(".musicplayer audio")[0].pause();
                            $(this).text("开");
                        } else if ($(this).text() == "开") {
                            $(".musicplayer audio")[0].play();
                            $(this).text("关");
                        }
                    });
                }
            }

            var restoremusicplayer = function(){
                if ($(".musicplayer").length > 0 && $(".search .qstr").length > 0) {
                    $(".search .qstr").attr("placeholder", $(".musicplayer audio").attr("title"));
                    addmusicswitch();
                } else{
                    $(".search .qstr").attr("placeholder", "搜索并播放歌曲");
                }
            }

            restoremusicplayer();

            //$(".search").submit(function(){
            $(".search").on("input propertychange paste", function(){
                $(".songsearchlist").remove();
                var qstr = $(this).find(".qstr");
                if (qstr.val().trim() == "") {
                    restoremusicplayer();
                    return false;
                } else {
                    $.ajax({
                        type: "get",
                        url: "https://c.y.qq.com/soso/fcgi-bin/search_cp?remoteplace=txt.yqq.center&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=" + qstr.val() + "&jsonpCallback=?&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
                        dataType: "jsonp",
                        //jsonpCallback:"hulumusic",
                        success: function(data){
                            var songlist = data.data.song.list.slice(0,3);
                            $(".search").after("<div class=\"songsearchlist\" style=\"position:fixed;border:1px solid lightgray;background:whitesmoke;line-height:24px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;\"></div>");
                            $(".songsearchlist").css({"width": $(".search").width(), "top": $(".search").offset().top + $(".search").height(), "left": $(".search").offset().left});
                            $(window).resize(function() {
                                $(".songsearchlist").css({"width": $(".search").width(), "top": $(".search").offset().top + $(".search").height(), "left": $(".search").offset().left});
                            });
                            $("body").click(function(){
                                $(".songsearchlist").remove();
                            });
                            for (var songid in songlist) {
                                var song = songlist[songid];
                                if ($(".songsearchlist .songsearchitem").length < 3 && song.songmid != "") {
                                    $(".songsearchlist .songsearchitem").each(function(){
                                        if($(this).attr("songmid") == song.songmid){
                                            return false;
                                        }
                                    });
                                    $(".songsearchlist").append("<div class=\"songsearchitem\" songmid=\"" + song.songmid + "\" style=\"cursor:pointer;\">" + song.singer[0].name + " - " + song.songname + "</div>");
                                }
                            }
                            $(".songsearchlist .songsearchitem").css({
                                "white-space": "nowrap",
                                "overflow": "hidden",
                                "text-overflow": "ellipsis"
                            });
                            $(".songsearchlist .songsearchitem").mouseover(function(){
                                $(this).css({
                                    "background": "lightgray"
                                });
                            }).mouseout(function(){
                                $(this).css({
                                    "background": ""
                                });
                            });

                            $(".songsearchlist .songsearchitem").click(function(){
                                //var songmid = data.data.song.list[0].songmid;
                                var songmid = $(this).attr("songmid");
                                if(songmid != ""){
                                    $.ajax({
                                        type: "get",
                                        url: "https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=" + songmid + "&tpl=yqq_song_detail&format=jsonp&callback=?&jsonpCallback=?&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",
                                        dataType: "jsonp",
                                        //jsonpCallback:"getOneSongInfoCallback",
                                        success: function(data){
                                            var url = "";
                                            for(i in data.url){
                                                url = data.url[i];
                                            }
                                            if (url != ""){
                                                var info = data.data[0].singer[0].name + " - " + data.data[0].title;
                                                if (url != "" && $("body").length > 0) {
                                                    if ($(".musicplayer").length > 0){
                                                        $(".search .musicswitch").remove();
                                                        $(".musicplayer").remove();
                                                    }
                                                    qstr.attr("placeholder", info);
                                                    $("body").after("<div class=\"musicplayer\"><audio autoplay=\"autoplay\" controls=\"controls\" loop=\"loop\" preload=\"preload\" style=\"width: 100%;display: none;\" src=\"http://" + url + "\" title=\"" + info + "\">浏览器不支持</audio></div>");
                                                    //addmusicswitch();
                                                    restoremusicplayer();
                                                    $(".search .qstr").val("");
                                                    $(".search .qstr").focus().blur();
                                                    $(".songsearchlist").remove();

                                                    $(".musicplayer audio").on("error", function() {
                                                        if ($(".musicplayer").length > 0){
                                                            $(".search .musicswitch").remove();
                                                            $(".musicplayer").remove();
                                                        }
                                                        qstr.attr("placeholder", "没有找到");
                                                        $(".search .musicswitch").remove();
                                                        $(".musicplayer").remove();
                                                    });
                                                } else {
                                                    qstr.attr("placeholder", "没有找到");
                                                    $(".search .musicswitch").remove();
                                                    $(".musicplayer").remove();
                                                }
                                            } else {
                                                qstr.attr("placeholder", "没有找到");
                                                $(".search .musicswitch").remove();
                                                $(".musicplayer").remove();
                                            }
                                        },
                                        error: function(){
                                            qstr.attr("placeholder", "没有找到");
                                            $(".search .musicswitch").remove();
                                            $(".musicplayer").remove();
                                        }
                                    });
                                } else {
                                    qstr.attr("placeholder", "没有找到");
                                    $(".search .musicswitch").remove();
                                    $(".musicplayer").remove();
                                }
                            });
                        },
                        error: function(){
                            qstr.attr("placeholder", "没有找到");
                            $(".search .musicswitch").remove();
                            $(".musicplayer").remove();
                        }
                    });
                    //qstr.val("");
                    //return false;
                }
            });

        //}

        if($(".content").hasClass("home")){
            homeevent();
        }
        if($(".content").hasClass("item")){
            itemviewevent();
        }
        if($(".content").hasClass("tag")){
            tagevent();
        }

        ajaxget($("a"));
        ajaxpost($("form").not(".additemtag").not(".newtagform"));
    }

    var ajaxloadpage = function(url, data){
        var locationhostname = window.location.pathname;
        window.history.pushState({
            "url": window.location.href,
            "pathname": window.location.pathname,
            "title": document.title
        }, $(data).filter("title").text(), url);
        document.title = $(data).filter("title").text();
        $(".wrapper").remove();
        if (url == "/m/" || locationhostname == "/m/" || url.split("/")[3] == "m") {
            $("head").find("link").remove();
            $(data).filter("link").appendTo("head");
            setTimeout(function(){
                $(data).filter(".wrapper").appendTo("body");
            }, 0);
        } else {
            $(data).filter(".wrapper").appendTo("body");
        }
        commonevent();
        $("html,body").animate({scrollTop:0}, 0);
        $("body .ajaxloading").remove();
    }

    var ajaxchangeurl = function(url){
        var locationhostname = window.location.pathname;
        window.history.pushState({
            "url": window.location.href,
            "pathname": window.location.pathname,
            "title": document.title
        }, $("body").find("title").text(), url);
        document.title = $("body").find("title").text();
    }

    var ajaxload = function(url){
        if($("body .ajaxloading").length == 0) {
            //$(".header").append("<div class=\"ajaxloading\"><span></span></div>");
            $(".wrapper").after($("<div class=\"ajaxloading\" style=\"background:lightgray;opacity:0.8;top:0;position:fixed;z-index:999;width:100%;height:100%;margin:0;padding:0;vertical-align:middle;\"><div class=\"loading-content\" style=\"text-align:center;width:100%;height:10px;position:absolute;top:50%;margin-top:-5px;\"><span style=\"\">" + (($('html').attr('lang') == "zh")?"加载中…":"loading...") + "</span></div></div>"));
            /*$.ajax({
                type: "GET",
                url: url,
                success: function(data){
                    ajaxloadpage(url, data);
                },
                dataType: "html",
                error: function(){
                    //$(".header .ajaxloading").remove();
                    $("body .ajaxloading").remove();
                }
            });*/
            $("body").load(url + " .wrapper", function(data){
                ajaxchangeurl(url, data);
                commonevent();
            });
        }
    }

    var ajaxget = function(obj){
        if(window.history && window.history.pushState) {
            obj.click(function(e){
                //e.preventDefault();
                var thus = $(this);
                var event_obj = $._data(thus[0], "events");
                if (event_obj && event_obj["click"] && event_obj["click"].length > 1) {

                } else {
                    if (thus.attr("href") && !thus.hasClass("oauthbtn") && (thus.attr("href").split("//").length == 1 || (thus.attr("href").split("//").length > 1 && thus.attr("href").split("//")[1].split("/")[0] == window.location.host))) {
                        ajaxload(thus.attr("href"));
                        return false;
                    }
                }
            });
        }
    }

    var ajaxpost = function(obj){
        if(window.history && window.history.pushState) {
            obj.submit(function(e){
                e.preventDefault();
                var thus = $(this);
                if(thus.attr("action")){
                    var url = thus.attr("action");
                } else {
                    var url = window.location.href;
                }
                var event_obj = $._data(thus[0], "events");
                //if (event_obj && event_obj["submit"] && event_obj["submit"].length > 1) {

                //}
                if(thus.attr("method") && thus.attr("method").toLowerCase() == "post"){
                    if($("body .ajaxloading").length == 0) {
                        //$(".header").append("<div class=\"ajaxloading\"><span></span></div>");
                        $(".wrapper").after($("<div class=\"ajaxloading\" style=\"background:lightgray;opacity:0.8;top:0;position:fixed;z-index:999;width:100%;height:100%;margin:0;padding:0;vertical-align:middle;\"><div class=\"loading-content\" style=\"text-align:center;width:100%;height:10px;position:absolute;top:50%;margin-top:-5px;\"><span style=\"\">" + (($('html').attr('lang') == "zh")?"加载中…":"loading...") + "</span></div></div>"));
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: thus.serialize(),
                            success: function(data, status, xhr){
                                if ($(data).filter("meta[name=uri]") && $(data).filter("meta[name=uri]").attr("content")){
                                    var url = $(data).filter("meta[name=uri]").attr("content");
                                    ajaxloadpage(url, data);
                                }
                            },
                            dataType: "html",
                            error: function(){
                                //$(".header .ajaxloading").remove();
                                $("body .ajaxloading").remove();
                            }
                        });
                    }
                }
                if(thus.attr("method") && thus.attr("method").toLowerCase() == "get"){
                    if($("body .ajaxloading").length == 0) {
                        //$(".header").append("<div class=\"ajaxloading\"><span></span></div>");
                        $(".wrapper").after($("<div class=\"ajaxloading\" style=\"background:lightgray;opacity:0.8;top:0;position:fixed;z-index:999;width:100%;height:100%;margin:0;padding:0;vertical-align:middle;\"><div class=\"loading-content\" style=\"text-align:center;width:100%;height:10px;position:absolute;top:50%;margin-top:-5px;\"><span style=\"\">" + (($('html').attr('lang') == "zh")?"加载中…":"loading...") + "</span></div></div>"));
                        $.ajax({
                            type: "GET",
                            url: url,
                            data: thus.serialize(),
                            success: function(data){
                                ajaxloadpage(url, data);
                            },
                            dataType: "html",
                            error: function(){
                                //$(".header .ajaxloading").remove();
                                $("body .ajaxloading").remove();
                            }
                        });
                        return false;
                    }
                }
            });
        }
    }

    if(window.history && window.history.pushState) {
        if(!window.isaddpopstateevent){
            window.addEventListener("popstate", function(e){
                //$(".header").append("<div class=\"ajaxloading\"><span></span></div>");
                $(".wrapper").after($("<div class=\"ajaxloading\" style=\"background:lightgray;opacity:0.8;top:0;position:fixed;z-index:999;width:100%;height:100%;margin:0;padding:0;vertical-align:middle;\"><div class=\"loading-content\" style=\"text-align:center;width:100%;height:10px;position:absolute;top:50%;margin-top:-5px;\"><span style=\"\">" + (($('html').attr('lang') == "zh")?"加载中…":"loading...") + "</span></div></div>"));
                $.ajax({
                    type: "GET",
                    url: window.location.href,
                    success: function(data){
                        document.title = $(data).filter("title").text();
                        $(".wrapper").remove();
                        if ((e.state && e.state.pathname == "/m/") || window.location.pathname == "/m/") {
                            $("head").find("link").remove();
                            $(data).filter("link").appendTo("head");
                            setTimeout(function(){
                                $(data).filter(".wrapper").appendTo("body");
                            }, 0);
                        } else {
                            $(data).filter(".wrapper").appendTo("body");
                        }
                        $("html,body").animate({scrollTop:0}, 0);
                    },
                    dataType: "html",
                    error: function(){
                        //$(".header .ajaxloading").remove();
                        $("body .ajaxloading").remove();
                    }
                });
            }, false);
            window.isaddpopstateevent = true;
        }
    }

    commonevent();
});
