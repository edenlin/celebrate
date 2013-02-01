requirejs.config({
	baseUrl: '../../',
	paths: {
		'cele':'celebrate/src',
		'third_party':'celebrate/third_party'
	}
});

requirejs(['cele/musician','cele/drumset'],function(Mgroup,Drumset)
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

	function onhit(id)
	{
		if( musi[id])
			musi[id].onhit();
	}

	setInterval(frame,1000/10);
	function frame()
	{
		for( var i in musi)
			musi[i].frame();

		//calculate fps
		var ot=this.time;
		this.time=new Date().getTime();
		var diff=this.time-ot;
		$('fps').value = Math.round(1000/diff)+'fps';
	}

	function $(id)
	{
		return document.getElementById(id);
	}
});
