define(['cele/gamedata','cele/chart','cele/sound'],
function(gamedata,Chart,create_sound){

var chart_config=
{
	div: $('chart'),	//chart element
	width: 1000,		//width in px
	timescale: 300,		//length in pixels representing one second
	block: { w:50, h:50}, //size of a block
	lineheight: 70,		//line height
	lines: 3,			//number of lines
	basebeat: 2,		//interval of basebeat in seconds, visualized by bars
	data: gamedata,		//data object exported by `editor`
	ondata: ondata,		//return the y position and sprite frame of a beat
	beat:		//animator and sprite config for a beat
	{
		x:0, y:0,     //top left margin of the frames
		w:52, h:50,   //width, height of a frame
		gx:10,gy:1,   //define a gx*gy grid of frames
		img:'beats.png', //image
		centerx: 50/2, centery: 50/2, //center point to check for coincidence
		dist: 30 //if(dist<30) when hit, change to `hitframe`
	},
	mark:		//mark at the left most of each line
	{
		x:0, y:50,
		w:70, h:70,
		gx:10, gy:1,
		img:'beats.png',
		line:[ //sprite frame index at each line
		0,
		0,
		1],
		centerx: 70/2, centery: 70/2
	},
	hitmark:	//mark when a proper beat is being hit
	{
		x:0, y:0,
		w:400, h:180,
		gx:10, gy:1,
		img:'mark.png',
		centerx: 180/2, centery: 180/2,
		dist: 30, //if(dist<30) when hit, show the hitmark
		frame: 0,
		showtime: 0.1
	},
	onhit: onhit,
	onmiss: onmiss
}

function ondata(v)
{
	var res=
	{
		y: 0,
		frame: 0,
		hit_frame: 0
	}
	switch(v)
	{
		case 'd3': case 'd4': case 'd5': case 'd6': case 'd7': 
		case 'df': case 'dv': 
		res.frame = 2;
		res.hitframe = 3;
		break;

		case 'dr': case 'dt': case 'dy': case 'du':
		case 'db': case 'dg': case 'dn':
		res.frame = 0;
		res.hitframe = 1;
		break;
	}
	var padding = (chart_config.lineheight - chart_config.block.h)/2;
	switch(v)
	{
		case 'dr': case 'dt': case 'dy': case 'du':
			res.y = padding;
		break;
		case 'dg': case 'db': case 'dn':
			res.y = chart_config.lineheight + padding;
		break;
		case 'd3': case 'd4': case 'd5': case 'd6': case 'd7': 
		case 'df': case 'dv': 
			res.y = chart_config.lineheight * 2 + padding;
		break;
	}

	return res;
}

function onhit(dist)
{
	//hit message
	var mess;
	var showtime = 0.2;
	if( dist <= 15)
		mess = 'perfect';
	else if( dist <= 30)
		mess = 'good';
	else if( dist <= 45)
		mess = 'bad';
	else
		mess = 'miss';
	
	if( mess === lastmessage.mess)
	{
		lastmessage.count++;
		$('hitcount').innerHTML = lastmessage.count;
	}
	else
	{
		lastmessage.count = 0;
		$('hitcount').innerHTML = '';
	}
	$('hitcount').className = $(mess).className;
	lastmessage.mess = mess;
	show($(mess));
	show($('hitcount'));
	$('hitmessage').className = 'pop';
	setTimeout(function()
	{
		$('hitmessage').className = '';
	}, 1000*showtime/6);
	setTimeout(function()
	{
		hide($(mess));
		hide($('hitcount'));
	}, 1000*showtime);
	
	if( dist <= 45)
		return true; //return true to mark the beat as `cleared`
}
function onmiss()
{
	onhit(1000);
}

var lastmessage=
{
	mess: '',
	count: 0
}
hide($('perfect'));
hide($('good'));
hide($('bad'));
hide($('miss'));

var music;
create_sound.ready(function()
{
	music = create_sound('../music/Jubilant',
	{
		timeupdate: function(t)
		{
			chart.frame(t);
		}
	});
	music.play();
});

var chart = new Chart(chart_config);

document.addEventListener("keydown", keydown, true);
function keydown(e)
{
	if (!e) e = window.event;
	var a = e.keyCode;
	switch (String.fromCharCode(a).toLowerCase())
	{
	case 'v':
		chart.hit(0);
		return true;
	
	case 'b':
		chart.hit(1);
		return true;
	
	case ' ':
		chart.hit(2);
		return true;
	
	case 'p':
		music.pause();
		return true;
	}
}

//helpers
function $(id)
{
	return document.getElementById(id);
}
function show(el)
{
	el.style.display='';
}
function hide(el)
{
	el.style.display='none';
}

});
