define(['cele/sprite-data','F.core/sprite','F.core/animator'],
function(sprite_data, Fsprite, Fanimator)
{
	function Mgroup(group)
	{
		this.musi=[];

		var DIV = group.getElementsByTagName('span');
		var DIV_L = DIV.length;
		var copy = parseInt(group.getAttribute('copy'));
		if( !copy) copy=1;
		//
		for( var k=0; k<copy; k++)
		{	//for each copy
			for( var j=0; j<DIV_L; j++)
			{	//for each div
				var div = DIV[j];
				var spid = div.getAttribute('sprite');
				if( spid)
				{
					this.musi.push( new Musi(group,spid));
				}
			}
		}
	}
	Mgroup.prototype.frame=function()
	{
		for( var i=0; i<this.musi.length; i++)
			this.musi[i].frame();
	}
	Mgroup.prototype.onhit=function()
	{
		for( var i=0; i<this.musi.length; i++)
			this.musi[i].onhit();
	}

	function Musi(canvas,spid)
	{
		var spo=sprite_data[spid];
		var sp_config=
		{
			canvas: canvas,
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
		this.ani_length = spo.ani.length;
		this.ani.rewind();
		this.active=false;
	}
	Musi.prototype.frame=function()
	{
		if( this.active)
		{
			var res=this.ani.next_frame();
			//if( res===this.ani_length-1)
			if( res===0)
				this.active=false;
		}
	}
	Musi.prototype.onhit=function()
	{
		this.ani.rewind();
		this.active=true;
	}

	return Mgroup;
});
