requirejs.config({
	baseUrl: '../../',
	paths: {
		'cele':'celebrate/src',
		'third_party':'celebrate/third_party'
	}
});

requirejs(['cele/musician'],function(Musi)
{
	var musi=[];

	var GROUP = $('musicians').getElementsByClassName('group');
	for( var i=0; i<GROUP.length; i++)
	{	//for each group
		var DIV = GROUP[i].getElementsByTagName('div');
		for( var j=0; j<DIV.length; j++)
		{	//for each div
			var div = DIV[j];
			var spid = div.getAttribute('sprite');
			if( spid)
			{
				musi.push( new Musi(div,spid));
			}
		}
	}

	setInterval(frame,1000/10);

	function frame()
	{
		for( var i=0; i<musi.length; i++)
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
