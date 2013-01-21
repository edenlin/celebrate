define(['F.core/css!celebrate/src/drum.css','third_party/buzz','F.core/effects-pool'],
function(dumpcss,dumpbuzz,Feffects_pool)
{
	function drumset( drumsetel, onhit )
	{
		var This=this;
		this.onhit=onhit;
		this.set={};
		this.key=
		{
			//'key':'id'
		};
		//
		drumsetel.setAttribute('class','drumset');
		var DRU = drumsetel.getElementsByTagName('div');
		for( var i=0; i<DRU.length; i++)
		{
			var drum=DRU[i];
			var key = drum.getAttribute('key');
			var vol = drum.getAttribute('vol');
			var sound = drum.getAttribute('sound');
			var radius = drum.getAttribute('radius');
			var color = drum.getAttribute('color');
			var img = drum.getAttribute('img');
			//
			if( key)
				this.key[key]=drum.id;
			if( vol)
				vol = parseInt(vol);
			if( sound)
			{	//create sound
				drum.onclick=function()
				{
					This.hit(this.id);
				}
				var ef_config=
				{
					init_size: 4,
					batch_size: 4,
					max_size: 12,
					construct: (function(sod,vo)
					{
						return function ()
						{
							return new drumplet(sod,vo);
						}
					}(sound,vol))
				}
				this.set[drum.id] = new Feffects_pool(ef_config);
			}
			if( radius)
			{
				drum.style.width= radius*2+'px';
				drum.style.height= radius*2+'px';
				drum.style.borderRadius = radius+'px';
			}
			if( color)
			{
				drum.style.background= color;
			}
			if( img)
			{
				var im = document.createElement('img');
				im.src = img;
				im.setAttribute('class','drumimg');
				drum.appendChild(im);
			}
		}
		//
		if( !isEmpty(this.key))
		{
			document.addEventListener("keydown", keydown, true);
			function keydown(e)
			{
				if (!e) e = window.event;
				var key = keycode_to_keyname(e.keyCode);
				return This.hit(This.key[key]);
			}
		}
	}
	drumset.prototype.hit=function(id)
	{
		if( this.set[id])
		{
			this.set[id].create();
			if( this.onhit)
				this.onhit(id);
			return true;
		}
	}
	//
	var buzz_config=
	{
		preload: true,
		autoplay: false,
		loop: false
	}
	function drumplet(sound,vol)
	{
		var has_extension=false;
		if( sound.indexOf('.mp3')!==-1 ||
			sound.indexOf('.ogg')!==-1 ||
			sound.indexOf('.wav')!==-1 )
			has_extension=true;
		buzz_config.formats= has_extension ? null:['mp3','ogg'];
		//
		var This=this;
		this.sound = new buzz.sound( '../sound/'+sound, buzz_config);
		if( vol && vol>=0 && vol<=100)
			this.sound.setVolume(vol);
		this.sound.bind('ended', function()
		{
			This.parent.die();
		});
	}
	drumplet.prototype.born=function()
	{
		this.sound.play();
	}
	//
	function keycode_to_keyname(code)
	{
		if( (code>='A'.charCodeAt(0) && code<='Z'.charCodeAt(0)) ||
			(code>='0'.charCodeAt(0) && code<='9'.charCodeAt(0)) )
		{
			return String.fromCharCode(code).toLowerCase();
		}
		return '';
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
