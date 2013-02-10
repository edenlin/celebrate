requirejs.config({
	baseUrl: '../../',
	paths: {
		'cele':'celebrate/src',
		'third_party':'celebrate/third_party'
	}
});

requirejs(['cele/gamedata','cele/chart','cele/sound','cele/iconset'],
function(gamedata,Chart,create_sound,iconset){

var chart_config=
{
	div: $('chart'),	//chart element
	width: 900,		//width in px
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
		text:[ //display symbol of each line
		'v',
		'b',
		'_'
		],
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
	fly:	//fly away after being hit
	{
		to:
		{
			x: 500, y: -10
		},
		height: 200,
		steps: 12,
		div: $('flyers')
	},
	onhit: onhit,
	onmiss: onmiss
}
var judge=
{
	perfect: 15,
	good: 30,
	bad: 45
}
var scoring=
{
	perfect: 3,
	good: 2,
	bad: 1,
	miss: -1
}
var score=
{
	total: 0,
	perfect: 0,
	good: 0,
	bad: 0,
	miss: 0,
	fault_presses: 0,
	max_cont_perfect: 0,
	max_cont_good: 0,
	max_cont_bad: 0,
	max_cont_miss: 0
}

//smaller
var smaller = 0.8;
chart_config.block.w *= smaller;
chart_config.block.h *= smaller;
chart_config.lineheight *= smaller;
chart_config.timescale *= smaller;
chart_config.beat.w *= smaller;
chart_config.beat.h *= smaller;
chart_config.beat.centerx *= smaller;
chart_config.beat.centery *= smaller;
chart_config.beat.dist *= smaller;
chart_config.mark.y *= smaller;
chart_config.mark.w *= smaller;
chart_config.mark.h *= smaller;
chart_config.mark.centerx *= smaller;
chart_config.mark.centery *= smaller;
chart_config.hitmark.w *= smaller;
chart_config.hitmark.h *= smaller;
chart_config.hitmark.centerx *= smaller;
chart_config.hitmark.centery *= smaller;
chart_config.hitmark.dist *= smaller;
chart_config.beat.img = 'beats-small.png';
chart_config.mark.img = 'beats-small.png';
chart_config.hitmark.img = 'mark-small.png';
judge.perfect *= smaller;
judge.good *= smaller;
judge.bad *= smaller;

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

function onhit(id,dist)
{
	//hit message
	var mess;
	var showtime = 0.2;
	var extended=1;
	if( dist <= judge.perfect)
		mess = 'perfect';
	else if( dist <= judge.good)
		mess = 'good';
	else if( dist <= judge.bad)
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
	//
	score[mess] += 1;
	score.total += scoring[mess];
	if( lastmessage.count > score['max_cont_'+mess])
		score['max_cont_'+mess] = lastmessage.count;
	$('currentscore').innerHTML = '<span class="green">'+score.total+'</span>';
	//
	if( lastmessage.count > 10)
		extended = 2;
	else if( lastmessage.count > 20)
		extended = 5;
	$('hitcount').className = $(mess).className;
	lastmessage.mess = mess;
	//
	show($(mess));
	show($('hitcount'));
	$('hitmessage').className = 'pop';
	$('currentscore').className = 'pop';
	setTimeout(function()
	{
		$('hitmessage').className = '';
		$('currentscore').className = '';
	}, 1000*showtime/6);
	setTimeout(function()
	{
		hide($(mess));
		hide($('hitcount'));
	}, 1000*showtime*extended);

	if( dist <= judge.bad)
	{
		iconset.drumset.hit(iconset.drumset.key[id.slice(1)]);
		return true; //return true to mark the beat as `cleared`
	}
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
hide($('scoreboard'));

var music;
var paused = false;
var chart = new Chart(chart_config);

create_sound.ready(function()
{
	music = create_sound('../music/Jubilant',
	{
		timeupdate: function(t)
		{
			chart.frame(t);
		},
		ended: function()
		{
			document.removeEventListener("keydown", keydown, true);
	$('scoreboard').innerHTML = 
	'<span style="font-size: 40px;">Score: '+score.total+'</span><br>'+
	'Perfect: '+score.perfect+', '+'Good: '+score.good+', '+'Bad: '+score.bad+','+'Miss: '+score.miss+'<br>'+
	'max. cont. Perfect: '+score.max_cont_perfect+'<br>'+
	'max. cont. Good: '+score.max_cont_good+'<br>'+
	'max. cont. Bad: '+score.max_cont_bad+'<br>'+
	'max. cont. Miss: '+score.max_cont_miss+'<br>';
	show($('scoreboard'));
		},
		loaded: function()
		{
			$('start').className = 'bigbutton';
			$('start').innerHTML = 'Start';
		}
	});
});

$('start').onclick=function()
{
	if( this.innerHTML==='Start')
	{
		hide($('start'));
		hide($('instruction'));
		$('musicians').className = 'gamestarted';
		iconset.drumset.removeEventListener();
		chart.pre_run(function()
		{
			music.play();
			//music.setTime(59);
		});
	}
}

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
	
	case ' ': /* IE9? */
		chart.hit(2);
		return true;
	
	case 'p':
		if( paused)
			music.play();
		else
			music.pause();
		paused = !paused;
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
