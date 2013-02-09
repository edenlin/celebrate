define(['F.core/effects-pool','F.core/sprite','F.core/animator'],
function (Fset,Fsprite,Fanimator){

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
	this.bars = new Fset(br_config);
	this.beats = new Fset(bt_config);

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
				canvas: $('marks'),
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
	
	//hitmessage
	if( config.hitmessage)
	{
		this.hitmessages = [];
		for( var i=0; i<config.hitmessage.list.length; i++)
		{
			var mes = config.hitmessage.list[i];
			config.hitmessage.div.innerHTML += mes.html;
			this.hitmessages[i] =
			{
				dist: mes.dist,
				el: null
			}
		}
		for( var i=0; i<config.hitmessage.list.length; i++)
		{
			this.hitmessages[i].el = config.hitmessage.div.children[i];
			this.hitmessages[i].el.style.display = 'none';
		}
	}
	
	//for `frame`
	this.lasttime = 0; //serve to calculate the time difference between frames
	this.lastbar = 0; //time when last bar is born
	this.beatcursor = 0; //the array index on `data.beats` of the lastest not-yet-born beat
	this.hitmessout = 0; //timeout of hit messages
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
			this.beats.create(config.width, res.y, res.frame, res.hitframe);
		}
		this.beatcursor=j;
	}
	
	//hitmessout
	if( this.hitmessout!=='cleared' && time >= this.hitmessout)
	{
		for( var i=0; i<this.hitmessages.length; i++)
			this.hitmessages[i].el.style.display = 'none';
		this.hitmessout = 'cleared';
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
	
	//wrap up
	this.lasttime = time;
}
/*\
 * Chart.test_run
 [ method ]
 * use a timer to test run the chart
\*/
Chart.prototype.test_run=function(slow)
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
		This.frame(time);
	}, 1000/45);
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
			//beat hit change frame
			if( dist <= This.config.beat.dist)
				K.hit();
			//hit mark
			if( dist <= This.config.hitmark.dist)
			{
				This.hitmarks[line].show();
				This.hitmarkout = This.lasttime + This.config.hitmark.showtime;
			}
			for( var i=0; i<This.hitmessages.length-1; i++)
			{
				//hit message
				if( dist <= This.hitmessages[i].dist)
				{
					K.clear();
					show_and_update(i);
					return 'break';
				}
			}
			//else
			show_and_update(This.hitmessages.length-1);
			return 'break';
		}
	});
	
	function show_and_update(I)
	{
		This.hitmessages[I].el.style.display=''; //show the message!
		This.hitmessout = This.lasttime + This.config.hitmessage.showtime;
	}
}
/*\
 * Chart.missed
 [ method ]
 * a beat went out of chart before being hit
\*/
Chart.prototype.missed=function()
{
	this.hitmessages[this.hitmessages.length-1].el.style.display=''; //show the message!
	this.hitmessout = this.lasttime + this.config.hitmessage.showtime;
}

function Beat(type,config,holder)
{
	this.type=type;
	if( type==='beat')
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
}
Beat.prototype.born=function(x,y,frame,hitframe)
{
	set_xy(this.el, x, y);
	if( this.ani && frame!==undefined)
		this.ani.set_frame(frame);
	if( hitframe!==undefined)
		this.hitframe = hitframe;
}
Beat.prototype.die=function()
{
	set_xy(this.el, -1000);
	
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
	move_xy(this.el, -speed);
	if( get_xy(this.el).x < -this.width)
		this.parent.die();
}
Beat.prototype.hit=function()
{
	this.ani.set_frame(this.hitframe);
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

return Chart;

});
