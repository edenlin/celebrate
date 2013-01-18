define(['cele/sprite-data','core/sprite','core/animator'],
function(sprite_data, Fsprite, Fanimator)
{
	function Musi(div,spid)
	{
		var spo=sprite_data[spid];
		var sp_config=
		{
			div: div,
			wh: { x:spo.w, y:spo.h},
			img: 'sprites.png'
		}
		this.sp = new Fsprite(sp_config);
		var ani_config=
		{
			x:0, y:0,
			w:spo.w, h:spo.h,
			gx:10, gy:100,
			tar: this.sp,
			ani: spo.ani
		}
		this.ani = new Fanimator(ani_config);
	}

	Musi.prototype.frame=function()
	{
		this.ani.next_frame();
	}

	return Musi;
});
