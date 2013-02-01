/**	some shim over buzz and SM2
	methods are shimmed to mimic buzz, because it has more understandable method names
 */

define(['cele/drum'],function()
{
	if( typeof buzz!=='undefined')
	{
		/** config=
		{
			timeupdate,
			onload
		} */
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
				sound.bind('timeupdate', function()
				{
					config.timeupdate(this.getTime());
				})
			}
			if( config.onload)
			{
				sound.bind('loadedmetadata', function()
				{
					config.onload();
				});
			}
			return sound;
		}
		create_sound.ready=function(fun)
		{
			fun();
		}
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
