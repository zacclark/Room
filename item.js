function Item(title, width, height, circle) {
	// properties
	this.title 			= title;
	this.width 			= width;
	this.height 		= height;
	this.is_circle 	= circle;
	this.rotated 		= false;
	
	// elements
	this.elem 			= $('<div></div>');
	this.label 			= $('<span>' + this.title + '</span>');
	
	this.elem.append(this.label);
	this.load();
	
	this.style();
	var me = this;
	this.elem.draggable({
		containment: "parent",
		stop: function(){
			me.save();
		}
	});
	
	var last_click_time = Date.now();
	this.elem.click(function(){
		var this_click_time = Date.now();
		if (this_click_time - last_click_time < window.double_click_seconds * 1000) {
			this.rotated = !this.rotated;
			this.style();
			this.save();
		}
		last_click_time = this_click_time;
	});
}

Item.prototype.save = function() {
	if (!window.saving) return;
	
	window.localStorage[this.title] = [
		px_to_dim( this.elem.css('top').replace('px', '') ),
		px_to_dim( this.elem.css('left').replace('px', '') ),
		this.rotated
	].join(",")
}

Item.prototype.load = function() {
	if ( typeof(window.localStorage[this.title]) == 'undefined' ) return;
	var arr = window.localStorage[this.title].split(",");
	this.elem.css({
		top: dim_to_px( parseInt(arr[0]) ),
		left: dim_to_px( parseInt(arr[1]) )
	});
	if (arr[2] == "true") {
		this.rotated = true;
	}
}

Item.prototype.style = function() {
  var style_height = dim_to_px(this.height) - 2;
	var style_width  = dim_to_px(this.width) - 2;
	
	if (this.rotated) {
		var temp = style_height;
		style_height = style_width;
		style_width = temp;
	}
	
	this.label.css({
		display:'block',
		"margin-top":(style_height / 2) - 10
	});
	this.elem.css({
		position: 'absolute',
		width: style_width,
		height: style_height,
		border: '1px solid #000',
		cursor: 'pointer',
		overflow: 'hidden',
		"text-align": "center",
		"font-size":'10px',
		background:'rgba(255,255,255,0.8)'
	});
	
	if ( typeof(this.circle) != 'undefined' && this.circle == true ){
		this.elem.css({
			"-webkit-border-radius":dim_to_px(this.width)
		});
	}
}