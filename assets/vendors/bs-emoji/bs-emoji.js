/*
*
* Emoji
*
*/
function Hashtable() {
    this._hash = new Object();
    this.put = function(key, value) {
        if (typeof (key) != "undefined") {
            if (this.containsKey(key) == false) {
                this._hash[key] = typeof (value) == "undefined" ? null : value;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    this.remove = function(key) { delete this._hash[key]; }
    this.size = function() { var i = 0; for (var k in this._hash) { i++; } return i; }
    this.get = function(key) { return this._hash[key]; }
    this.containsKey = function(key) { return typeof (this._hash[key]) != "undefined"; }
    this.clear = function() { for (var k in this._hash) { delete this._hash[k]; } }
}

var emotions = new Array();
var categorys = new Array();
var uBsEmotionsHt = new Hashtable();

$(function() {
	$.ajax( {
		dataType : 'json',
		url : '/index.php/bearEmoji',
		success : function(response) {
		    //json = JSON.parse(response);
			data = response;
			for ( var i in data) {
				if (data[i].category == '') {
					data[i].category = 'OwO颜文字';
				}
				if (emotions[data[i].category] == undefined) {
					emotions[data[i].category] = new Array();
					categorys.push(data[i].category);
				}
				emotions[data[i].category].push( {
					name : data[i].data,
					icon : data[i].icon,
					text : data[i].text
				});
				uBsEmotionsHt.put(data[i].data, data[i].icon, data[i].text);
			}
		}
	});
});

//替换
function AnalyticEmotion(s) {
	if(typeof (s) != "undefined") {
		var sArr = s.match(/\[.*?\]/g);
		for(var i = 0; i < sArr.length; i++){
			if(uBsEmotionsHt.containsKey(sArr[i])) {
				var reStr = "<img src=\"" + uBsEmotionsHt.get(sArr[i]) + "\" />";
				s = s.replace(sArr[i], reStr);
			}
		}
	}
	return s;
}

(function($){
	$.fn.BearsimpleEmoji = function(target){
		var cat_current;
		var cat_page;
		$(this).click(function(event){
		    //console.log(event.target.id);
			event.stopPropagation();
			var eTop = target.offset().top + target.height() + 15;
			var eLeft = target.offset().left - 1;
			
			if($('.emotions .categorys')[0]){
				$('.emotions').css({top: eTop, left: eLeft});
				$('.emotions').toggle();
				return;
			}
	$('.emoemo').append('<div class="emotions"></div>');
		
			$('.emotions').css({top: eTop, left: eLeft});
			$('.emotions').html('<div>正在加载，请稍候...</div>');
			$('.emotions').click(function(event){
				event.stopPropagation();
			});
			
			$('.emotions').html('<div style="display:flex; align-items:center; gap:12px; padding:10px 15px; background:#f1f3f5; border-bottom:1px solid #e9ecef;"><div class="categorys"style="flex-grow:1; overflow-x:auto; display:flex; gap:8px; scrollbar-width:thin;"></div><div style="display:flex; gap:8px; flex-shrink:0; margin-left:12px;"><a href="javascript:void(0);"id="sync"style="display:inline-flex; padding:6px; border-radius:6px; background:#dee2e6; color:#343a40;"><i class="sync icon" style="margin-top:3px;margin-left:2px;"></i></a><a href="javascript:void(0);"id="prev"style="display:inline-flex; align-items:center; padding:6px 10px; border-radius:6px; background:#dee2e6; color:#343a40;">&laquo;</a><a href="javascript:void(0);"id="next"style="display:inline-flex; align-items:center; padding:6px 10px; border-radius:6px; background:#dee2e6; color:#343a40;">&raquo;</a></div></div><div class="container"></div><div class="page"></div>');
			$('.emotions #prev').click(function(){
				showCategorys(cat_page - 1);
			});
			$('.emotions #next').click(function(){
				showCategorys(cat_page + 1);
			});
			$('.emotions #sync').click(function(){
			showCategorys();
			showEmotions();
			});
			showCategorys();
			showEmotions();
			
		});
		$('body').click(function(){
			$('.emotions').fadeOut();
		});
		$.fn.insertText = function(text){
			this.each(function() {
				if(this.tagName !== 'INPUT' && this.tagName !== 'TEXTAREA') {return;}
				if (document.selection) {
					this.focus();
					var cr = document.selection.createRange();
					cr.text = text;
					cr.collapse();
					cr.select();
				}else if (this.selectionStart || this.selectionStart == '0') {
					var 
					start = this.selectionStart,
					end = this.selectionEnd;
					this.value = this.value.substring(0, start)+ text+ this.value.substring(end, this.value.length);
					this.selectionStart = this.selectionEnd = start+text.length;
				}else {
					this.value += text;
				}
			});        
			return this;
		}
		function showCategorys(){
		    
			var page = arguments[0]?arguments[0]:0;
			if(page < 0 || page >= categorys.length / 5){
				return;
			}
			$('.emotions .categorys').html('');
			cat_page = page;
			for(var i = page * 5; i < (page + 1) * 5 && i < categorys.length; ++i){
				$('.emotions .categorys').append($('<a href="javascript:void(0);">' + categorys[i] + '</a>'));
			}
			$('.emotions .categorys a').click(function(){
				showEmotions($(this).text());
			});
			$('.emotions .categorys a').each(function(){
				if($(this).text() == cat_current){
					$(this).addClass('current');
				}
			});
		}
		function showEmotions(){
			var category = arguments[0]?arguments[0]:'OwO颜文字';
			var page = arguments[1]?arguments[1] - 1:0;
			$('.emotions .container').html('');
			$('.emotions .page').html('');
			cat_current = category;
			for(var i = page * 72; i < (page + 1) * 72 && i < emotions[category].length; ++i){
			    if(cat_current == 'OwO颜文字'){
			   $('.emotions .container').append($('<a style="margin-left:5px;margin-bottom:5px;width:auto;height:auto" href="javascript:void(0);" title="' + emotions[category][i].name + '"><span>' +emotions[category][i].name + ' </span></a>'));     
			    }
			    else{
				$('.emotions .container').append($('<a href="javascript:void(0);" title="' + emotions[category][i].name + '"><img src="' + emotions[category][i].icon + '" alt="' + emotions[category][i].text + '" /></a>'));
				
				
			    }
			}
			$('.emotions .container a').click(function(){
				target.insertText($(this).attr('title'));
				if($("#friendcircle-comment-textarea").val().length > 1){
				$("#friendcircle-comment-container").attr("style", "box-shadow: inset 0px 0px 0px 1px #07c160;");
				$("#friendcircle-comment-submit").addClass("friendcircle-comment-readySubmit");  
				
				}
				$('.emotions').remove();
			});
			for(var i = 1; i < emotions[category].length / 72 + 1; ++i){
				$('.emotions .page').append($('<a href="javascript:void(0);"' + (i == page + 1?' class="current"':'') + '>' + i + '</a>'));
			}
			$('.emotions .page a').click(function(){
				showEmotions(category, $(this).text());
			});
			$('.emotions .categorys a.current').removeClass('current');
			$('.emotions .categorys a').each(function(){
				if($(this).text() == category){
					$(this).addClass('current');
				}
			});
		}
	}
})(jQuery);
