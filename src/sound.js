/**	some shim over buzz and SM2
	methods are shimmed to mimic buzz, because it has more understandable method names
 */

define(['cele/drum'],function()
{
	if( typeof buzz!=='undefined')
	{
		var sounds=[];
		var create_sound=function(filepath,config)
		{
			var has_extension=false;
			if( filepath.indexOf('.mp3')!==-1 ||
				filepath.indexOf('.ogg')!==-1 ||
				filepath.indexOf('.wav')!==-1 )
				has_extension=true;

			var sound = new buzz.sound( filepath,
			{
				formats: has_extension ? null:['mp3','ogg'],
				preload: true,
				autoplay: false,
				loop: false
			});
			if( config.timeupdate)
			{
				sound
				.bind('timeupdate', function()
				{
					var time = this.getTime();
					if( time > obj.time)
					{
						obj.time = time;
						config.timeupdate(obj.time);
					}
				})
				.bind('seeked',function()
				{
					obj.time = this.getTime();
				})
			}
			if( config.onload)
			{
				sound.bind('loadedmetadata', function()
				{
					config.onload();
				});
			}
			if( config.ended)
			{
				sound.bind('ended',function()
				{
					config.ended();
				});
			}
			if( config.loaded)
			{
				sound.bind('canplaythrough',function()
				{
					config.loaded();
				});
			}
			if( config.progress)
			{
				sound.bind('progress',function()
				{
					var total = 0;
					var buffered = sound.getBuffered();
					for( var i=0; i<buffered.length; i++)
					{
						total += buffered[i].end-buffered[i].start;
					}
					return Math.round(total/sound.getDuration()*100);
				});
			}
			var obj=
			{
				sound: sound,
				timeupdate: config.timeupdate,
				time: 0
			}
			sounds.push(obj);
			return sound;
		}
		create_sound.ready=function(fun)
		{
			fun();
		}
		var lasttime = new Date().getTime();
		setInterval(function()
		{
			var time = new Date().getTime();
			var dt = (Math.floor(time-lasttime))/1000;
			for( var i=0; i<sounds.length; i++)
			{
				if( !sounds[i].sound.isPaused())
				{
					if( dt<0.25)
					{
						sounds[i].time += dt;
						sounds[i].timeupdate(sounds[i].time);
					}
				}
			}
			lasttime = time;
		}, 1000/25);
		return create_sound;
	}
	else if( typeof soundManager!=='undefined')
	{
		/*	there is a hidden bug when requirejs is loaded dynamically by head.js
			and SM2 is loaded by requirejs, SM2 will be swapped away by subsequent head.js calls
		 */
		var count=0;
		var create_sound=function(filepath,config)
		{
			var has_extension=false;
			if( filepath.indexOf('.mp3')!==-1 ||
				filepath.indexOf('.ogg')!==-1 ||
				filepath.indexOf('.wav')!==-1 )
				has_extension=true;

			var sm_config=
			{
				id: ('mysound'+count++),
				url: filepath+(has_extension?'':'.mp3')
			}
			if( config.timeupdate)
			{
				sm_config.whileplaying=function()
				{
					config.timeupdate(this.position/1000);
				}
			}
			if( config.onload)
			{
				sm_config.onload=function()
				{
					if( this.readyState===3) //success
						config.onload();
				}
			}
			if( config.ended)
			{
				sm_config.onfinish=function()
				{
					config.ended();
				}
			}
			if( config.loaded)
			{
				sm_config.whileloading=function()
				{
					if( !this.canplaythrough)
					if( (this.bytesLoaded/this.bytesTotal) > 0.5)
					{
						config.loaded();
						this.canplaythrough = true;
					}
					else
					{
						if( config.progress)
							config.progress(Math.round(this.bytesLoaded/this.bytesTotal*100));
					}
				}
			}
			var sound = soundManager.createSound(sm_config);
			sound.getDuration=function()
			{
				return sound.duration/1000;
			}
			sound.setTime=function(tt)
			{
				sound.setPosition(tt*1000);
			}
			return sound;
		}
		create_sound.ready=function(fun)
		{
			soundManager.onready(fun);
		}
		return create_sound;
	}
});
