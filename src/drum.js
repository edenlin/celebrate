/** drum resolves between 2 implementations, HTML5 and Flash backend.
 */

//if ( !document.createElement( 'audio' ).canPlayType ||
//     window.location.href.match(/backend=flash/) )
if( true)
{
	/** use of Sound Manager 2 (SM2), which uses a Flash backend
		Flash 9 supports multishot natively and works slightly better than HTML5.
	 */
	console.log('Sound Manager 2 backend');
	define(['third_party/soundmanager2-nodebug-jsmin'],function()
	{
		soundManager.setup(
		{
			url: '../third_party/',
			debugMode: false,
			debugFlash: false,
			flashVersion: 9,
			//flashPollingInterval: 1000/30,
			preferFlash: true,
			useHighPerformance: true,
			useHTML5Audio: false,
			defaultOptions:
			{
				autoLoad: true,
				autoPlay: false,
				multiShot: true,
				multiShotEvents: true
			}
		});

		var count=0;
		function drum(baseurl,soundpath,vol)
		{
			var This=this;
			this.activecount = 0;

			var has_extension=false;
			if( soundpath.indexOf('.mp3')!==-1 ||
				soundpath.indexOf('.ogg')!==-1 ||
				soundpath.indexOf('.wav')!==-1 )
				has_extension=true;

			soundManager.onready(function()
			{
				This.sound = soundManager.createSound(
				{
					id: ('drum'+count++),
					url: baseurl+soundpath+(has_extension?'':'.mp3'),
					volume: (vol && vol>=0 && vol<=100)?vol:100,
					onfinish: function()
					{
						This.activecount--;
					}
				})
			});
		}
		drum.prototype.hit=function()
		{
			if( this.activecount < 20) //to prevent explosion
			{
				this.activecount++;
				this.sound.play();
			}
			else
				console.log('full');
		}
		return drum;
	});
}
else
{

	/**	use of buzz sound library, which is pure HTML5.
		one problem is HTML5 audio dont allow multiple instance playback
		of the same element (sometimes called multishot),
		so in order to add simultaneity, we have to create multiple sound
		elements and play them on demand.
		luckily, F.core provides a class `effects_pool` for this purpose.
	 */
	console.log('buzz backend');
	define(['F.core/effects-pool','third_party/buzz'],
	function (Feffects_pool)
	{
		function drum(baseurl,sound,volume)
		{
			var ef_config=
			{
				init_size: 4,
				batch_size: 4,
				max_size: 12,
				construct: function ()
				{
					return new drumplet(baseurl,sound,volume);
				}
			}
			this.ef = new Feffects_pool(ef_config);
		}
		drum.prototype.hit=function()
		{
			this.ef.create();
		}
		//
		var buzz_config=
		{
			preload: true,
			autoplay: false,
			loop: false
		}
		function drumplet(baseurl,sound,vol)
		{
			var has_extension=false;
			if( sound.indexOf('.mp3')!==-1 ||
				sound.indexOf('.ogg')!==-1 ||
				sound.indexOf('.wav')!==-1 )
				has_extension=true;
			buzz_config.formats= has_extension ? null:['mp3','ogg'];
			//
			var This=this;
			this.sound = new buzz.sound( baseurl+sound, buzz_config);
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
		return drum;
	});
}
