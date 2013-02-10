define(['F.core/effects-pool','F.core/sprite','F.core/animator','F.core/math'],
function (Fset,Fsprite,Fanimator,Fmath){

/*\
 * Chart
 [ class ]
\*/
function Chart(config)
{
	this.config=config;
	var div = config.div;
	var This = this;
	div.style.width = config.width+'px';
	div.style.height = config.lineheight*config.lines+'px';

	//holder layers
	create_element('div','bars',null,null,div);
	create_element('div','rules',null,null,div);
	create_element('div','beats',null,null,div);
	create_element('div','marks',null,null,div);
	create_element('div','hitmarks',null,null,div);
	
	//rules
	for( var i=1; i<config.lines; i++)
		set_xy(create_element('div',null,null,null,$('rules')), 0, i*config.lineheight);

	//bars & beats
	var br_config=
	{
		init_size: 5,
		batch_size: 5,
		max_size: 100,
		construct: function()
		{
			return new Beat( 'bar', null, $('bars'));
		}
	}
	var bt_config=
	{
		init_size: 20,
		batch_size: 10,
		max_size: 100,
		construct: function()
		{
			var bt = new Beat( 'beat', config.beat, $('beats'));
			bt.chart = This;
			return bt;
		}
	}
	var fy_config=
	{
		init_size: 20,
		batch_size: 10,
		max_size: 100,
		construct: function()
		{
			return new Beat( 'flyer', config.beat, config.fly.div, config.fly);
		}
	}
	this.bars = new Fset(br_config);
	this.beats = new Fset(bt_config);
	this.flyers = new Fset(fy_config);

	//marks
	this.marks=[];
	if( config.mark)
	for( var i=0; i<config.mark.line.length; i++)
	{
		var mark_sp_config=
		{
			canvas: $('marks'),
			wh: {x:config.mark.w, y:config.lineheight},
			img: config.mark.img
		}
		var mark_sp = new Fsprite(mark_sp_config);
		var mark_ani_config=
		{
			x: config.mark.x,  y:config.mark.y,
			w: config.mark.w,  h:config.mark.h,
			gx:config.mark.gx, gy:config.mark.gy,
			tar: mark_sp
		}
		var mark_ani = new Fanimator(mark_ani_config);
		mark_ani.set_frame(config.mark.line[i]);
		mark_sp.set_xy({ x:0, y:config.lineheight*i });
		this.marks.push(mark_sp);
		
		//text
		if( config.mark.text)
		{
			config.mark.text[i];
			var sym = create_element('span',null,'marktext',config.mark.text[i],mark_sp.el);
			sym.style.lineHeight = config.mark.h+'px';
		}
	}
	
	//hitmark
	this.hitmarks=[];
	if( config.hitmark)
	{
		var dx = config.hitmark.centerx - config.mark.centerx,
			dy = config.hitmark.centery - config.mark.centery;
		for( var i=0; i<config.mark.line.length; i++)
		{
			var hitmark_sp_config=
			{
				canvas: $('hitmarks'),
				wh: {x:config.hitmark.w, y:config.hitmark.h},
				img: config.hitmark.img
			}
			var hitmark_sp = new Fsprite(hitmark_sp_config);
			var hitmark_ani_config=
			{
				x: config.hitmark.x,  y:config.hitmark.y,
				w: config.hitmark.w,  h:config.hitmark.h,
				gx:config.hitmark.gx, gy:config.hitmark.gy,
				tar: hitmark_sp
			}
			var hitmark_ani = new Fanimator(hitmark_ani_config);
			hitmark_ani.set_frame(config.hitmark.frame);
			hitmark_sp.set_xy({ x:-dx, y:config.lineheight*i-dy });
			hitmark_sp.hide();
			this.hitmarks.push(hitmark_sp);
		}
	}
	
	//for `frame`
	this.lasttime = 0; //serve to calculate the time difference between frames
	this.lastbar = 0; //time when last bar is born
	this.beatcursor = 0; //the array index on `data.beats` of the lastest not-yet-born beat
	this.lycursor = 0;
	this.hitmarkout = 0;
}

/*\
 * Chart.frame
 [ method ]
 - (number) time in seconds, can have decimal
 * supply a frame event to chart, indicating current time
\*/
Chart.prototype.frame=function(time)
{
	var config = this.config;
	var data = config.data;
	var margin = time + config.width/config.timescale; //the right margin time
	
	//bars
	if( margin >= this.lastbar + config.basebeat)
	{
		this.bars.create(config.width);
		this.lastbar = Math.floor(margin/config.basebeat)*config.basebeat; //round down to basebeat time
	}
	//beats
	for( var j=this.beatcursor, beatlength=data.beats.length; j<beatlength; j++)
	{
		if( margin < data.beats[j].t)
			break;
	}
	if( j>this.beatcursor)
	{
		for( var k=this.beatcursor; k<j; k++)
		{
			var res=config.ondata(data.beats[k].v);
			this.beats.create(config.width, res.y, data.beats[k].v, res.frame, res.hitframe);
		}
		this.beatcursor=j;
	}
	//lyrics
	for( var j=this.lycursor, lylength=data.lyrics.length; j<lylength; j++)
	{
		if( time < data.lyrics[j].t)
			break;
	}
	if( j>this.lycursor)
	{
		for( var k=this.lycursor; k<j; k++)
		{
			$('lyrics').innerHTML = data.lyrics[k].v;
		}
		this.lycursor=j;
	}
	
	//hitmarkout
	if( this.hitmarkout!=='cleared' && time >= this.hitmarkout)
	{
		for( var i=0; i<this.hitmarks.length; i++)
			this.hitmarks[i].hide();
		this.hitmarkout = 'cleared';
	}
	
	//updates
	var diff= (time-this.lasttime)*config.timescale;
	this.bars .call_each('frame', diff);
	this.beats.call_each('frame', diff);
	this.flyers.call_each('frame', diff);
	
	//wrap up
	this.lasttime = time;
}
/*\
 * Chart.test_run
 [ method ]
 * use a timer to test run the chart
\*/
Chart.prototype.test_run=function(slow,cancel_on_0)
{
	var This=this;
	var begintime = new Date().getTime()/1000 + this.config.width/this.config.timescale + 1;
	var time = 0;
	//time begins at -10(say) to provide buffer time
	var clock = setInterval(function()
	{
		if( slow)
			time += slow;
		else
			time = new Date().getTime()/1000-begintime; //time in sec
		if( time>=0 && cancel_on_0)
		{
			clearInterval(clock);
			cancel_on_0();
			return ;
		}
		This.frame(time);
	}, 1000/45);
}
/*\
 * Chart.pre_run
 [ method ]
 * run from negative time (depends on width of chart) and callback when time==0
\*/
Chart.prototype.pre_run=function(callback)
{
	this.test_run(null,callback);
}
/*\
 * Chart.hit
 [ method ]
 * user attempts to hit a beat on a specific line
\*/
Chart.prototype.hit=function(line)
{
	var This = this;
	this.beats.for_each(function(K)
	{
		var pos = get_xy(K.el);
		var dist = Math.abs(pos.x+This.config.beat.centerx - This.config.mark.centerx);
		if( pos.y >= line*This.config.lineheight &&
			pos.y < (line+1)*This.config.lineheight)
		{
			if( K.cleared)
				return 'continue';
			//beat hit change frame
			if( dist <= This.config.beat.dist)
				K.hit();
			//hit mark
			if( dist <= This.config.hitmark.dist)
			{
				This.hitmarks[line].show();
				This.hitmarkout = This.lasttime + This.config.hitmark.showtime;
			}
			//onhit
			if( This.config.onhit)
			if( This.config.onhit(K.id,dist))
				K.clear();
			return 'break';
		}
	});
}
/*\
 * Chart.missed
 [ method ]
 * a beat went out of chart before being hit
\*/
Chart.prototype.missed=function()
{
	if( this.config.onmiss)
		this.config.onmiss();
}

function Beat(type,config,holder,fy_config)
{
	this.type=type;
	if( type==='beat' || type==='flyer')
	{
		var sp_config=
		{
			canvas: holder,
			wh: {x:config.w, y:config.h},
			img: config.img
		}
		var sp = new Fsprite(sp_config);
		var ani_config=
		{
			x: config.x,  y:config.y,
			w: config.w,  h:config.h,
			gx:config.gx, gy:config.gy,
			tar: sp
		}
		this.ani = new Fanimator(ani_config);
		this.el = sp.el;
		this.width = config.w;
		this.die();
	}
	if( type==='bar')
	{
		this.el = create_element('div',null,null,null,holder);
		this.width = parseInt(window.getComputedStyle(this.el).getPropertyValue('width'));
		if( !this.width)
			this.width = 1000;
		this.die();
	}
	if( type==='flyer')
	{
		this.fy_config=fy_config;
	}
}
Beat.prototype.born=function(x,y,id,frame,hitframe)
{
	set_xy(this.el, x, y);
	show(this.el);
	if( this.type==='beat')
	{
		if( id)
			this.id=id;
		if( this.ani && frame!==undefined)
			this.ani.set_frame(frame);
		if( hitframe!==undefined)
			this.hitframe = hitframe;
	}
	if( this.type==='flyer')
	{
		var A = {x:x, y:y};
		var B = this.fy_config.to;
		var C = {x:(A.x+B.x)/2, y:A.y-this.fy_config.height};
		this.curve = Fmath.bezier2(A,C,B,this.fy_config.steps);
		this.curve.I = 0;
		this.ani.set_frame(hitframe);
	}
}
Beat.prototype.die=function()
{
	hide(this.el);
	
	if( this.type==='beat')
	{
		if( !this.cleared)
			if( this.chart)
				this.chart.missed();
		this.cleared = false;
	}
}
Beat.prototype.frame=function(speed)
{
	if( this.type==='bar' || this.type==='beat')
	{
		move_xy(this.el, -speed);
		if( get_xy(this.el).x < -this.width)
			this.parent.die();
	}
	if( this.type==='flyer')
	{
		if( this.curve.I < this.curve.length/2)
		{
			set_xy(this.el, this.curve[this.curve.I].x, this.curve[this.curve.I].y);
			this.curve.I++;
		}
		else
		{
			this.curve=null;
			this.parent.die();
			return ;
		}
	}
}
Beat.prototype.hit=function(fly)
{
	if( this.type==='beat')
	{
		var A=get_xy(this.el);
		this.chart.flyers.create(A.x,A.y,null,null,this.hitframe);
		hide(this.el);
	}
}
Beat.prototype.clear=function()
{
	this.cleared = true;
}

//helpers
function set_xy(el,x,y)
{
	if( x!==undefined && x!==null)
		el.style.left = round(x)+'px';
	if( y!==undefined && y!==null)
		el.style.top  = round(y)+'px';
	return el;
}
function move_xy(el,x,y)
{
	if( x)
		el.style.left = round(x+parseFloat(el.style.left))+'px';
	if( y)
		el.style.top  = round(y+parseFloat(el.style.top))+'px';
	return el;
}
function get_xy(el)
{
	return {
		x: parseFloat(el.style.left),
		y: parseFloat(el.style.top)
	}
}
function create_element(tag,id,Class,innerHTML,appendto)
{
	var el = document.createElement(tag);
	if( id)
		el.id=id;
	if( Class)
		el.className=Class;
	if( innerHTML)
		el.innerHTML= innerHTML;
	if( appendto)
		appendto.appendChild(el);
	return el;
}
function round(v,d)
{
	if(d===undefined || d===null)
		d=2;
	var exp=1;
	for( var i=0; i<d; i++)
		exp*=10;
	return Math.round(v*exp)/exp;
}
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

return Chart;

});
