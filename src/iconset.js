define(['cele/musician','cele/drumset'],function(Mgroup,Drumset)
{
	var musi={};
	var GROUP = $('musicians').getElementsByClassName('group');
	for( var i=0; i<GROUP.length; i++)
	{	//for each group
		var group=GROUP[i];
		musi[group.id]= new Mgroup(group);
	}

	var drumset = new Drumset($('musicians'),
		{
			baseurl:'../sound/',
			onhit:onhit
		});

	function onhit(ID)
	{
		for( var i=0; i<ID.length; i++)
		{
			var id=ID[i];
			if( musi[id])
				musi[id].onhit();
		}
	}

	var timer = setInterval(frame,1000/10);
	function frame()
	{
		for( var i in musi)
			musi[i].frame();

		//calculate fps
		var ot=this.time;
		this.time=new Date().getTime();
		var diff=this.time-ot;
		//$('fps').value = Math.round(1000/diff)+'fps';
	}

	function $(id)
	{
		return document.getElementById(id);
	}

	return {
		musi: musi,
		drumset: drumset,
		timer: timer,
		hit: onhit
	}
});
