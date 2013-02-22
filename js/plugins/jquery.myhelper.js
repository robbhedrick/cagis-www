/**
  * File:		custom-jquery-plugins.js
  * Desc:		 
  * Version:	1.0
  * Author:		Robb HedricK 
  *
*/
(function($) {
	/**
	  * Plug: scrollT
	  * Desc: Simply clears attach form fields default value.
	*/		
	$.fn.scrollTo = function(ele) { // Scrolls page back to search results header.
		$('html, body').animate({
			scrollTop: $(ele).offset().top
		}, 200);
	};

	/**
	  * Plug: clear
	  * Desc: Simply clears attach form fields default value.
	*/	
	$.fn.clear = function() {
		return this.focus(function(){
			var v = $(this).val();
			$(this).val( v === this.defaultValue ? '' : v );
		}).blur(function(){
			var v = $(this).val();
			$(this).val( v.match(/^\s+$|^$/) ? this.defaultValue : v );
		});	
	};

	/**
	  * Plug: getValueByKey
	  * Desc: Return 
	*/	
	$.fn.getValueByKey = function(obj, key) {
		var res = false;
		$.each(obj, function (i, item) {
			if(item.Name == key){
				res = item.Value;
			}
		});
		return res;
	};
	
	/**
	  * Plug: loader
	  * Desc: Set submit button loader combination.
	*/
	$.fn.loader = function(s) {
		if(s){
			$(':button').hide();	
			$('img.loader').show();
		}else{
			$('img.loader').hide();
			$(':button').show();	
		}
	};	
	
})( jQuery );