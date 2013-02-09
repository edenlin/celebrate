/** drumset is class to create a full playable set of drums.
	it accepts a DOM element (specified by HTML) as config.
	each drum will be clickable and if an attribute `key` is specified,
	will also respond to keyboard input.

	drumset does not specify the underlying technology to play sounds,
	playback facility is implemented by drum-**.js which provides a Drum class,
	that the only important method is `hit`.
 */

define(['cele/drum','F.core/css!celebrate/src/drum.css'], function(Drum)
{
	/**
		config=
		{
			onhit,
			baseurl
		}
	 */
	function drumset( drumsetel, config)
	{
		var This=this;
		var baseurl='';
		if( config)
		{
			this.onhit=config.onhit;
			if( config.baseurl)
				baseurl=config.baseurl;
		}
		this.set=
		{
			//id: Drum
		}
		this.key=
		{
			//key: id
		}
		//
		drumsetel.className='drumset';
		var DRU = drumsetel.getElementsByTagName('div');
		for( var i=0; i<DRU.length; i++)
		{
			function attr(Name) { return drum.getAttribute(Name);}
			//
			var drum=DRU[i];
			var key = attr('key'),
				vol = attr('vol'),
				sound = attr('sound'),
				radius = attr('radius'),
				width = attr('width'),
				height = attr('height'),
				color = attr('color'),
				img = attr('img');
			//
			if( key)
				this.key[key]=drum.id;
			if( vol)
				vol = parseInt(vol);
			if( sound)
			{	//create sound
				drum.onmousedown=function()
				{
					This.hit(this.id);
				}
				this.set[drum.id] = new Drum(baseurl,sound,vol);
			}
			if( radius)
			{
				drum.style.width= radius*2+'px';
				drum.style.height= radius*2+'px';
				drum.style.borderRadius = radius+'px';
			}
			if( width)
				drum.style.width= width+'px';
			if( height)
				drum.style.height= height+'px';
			if( color)
			{
				drum.style.background= color;
			}
			if( img)
			{
				var im = document.createElement('img');
				im.src = img;
				im.className='drumimg';
				drum.appendChild(im);
			}
		}
		//
		if( !isEmpty(this.key))
		{
			function keydown(e)
			{
				if (!e) e = window.event;
				var key = String.fromCharCode(e.keyCode).toLowerCase();
				return This.hit(This.key[key]);
			}
			document.addEventListener("keydown", keydown, true);
			this.removeEventListener=function()
			{
				document.removeEventListener("keydown", keydown, true);
			}
		}
	}
	drumset.prototype.hit=function(id /*,arg*/) //arguments will be passed through
	{
		if( this.set[id])
		{
			if( this.onhit)
			{
				this.onhit.apply(null, arguments);
			}
			this.set[id].hit();
			return true;
		}
	}
	function isEmpty(obj)
	{
		for(var prop in obj)
		{
		    if(obj.hasOwnProperty(prop))
		        return false;
		}
		return true;
	}

	return drumset;
});
