# Celebrate
![screenshot](http://tyt2y3.github.com/celebrate/web/image/cap01.png)
Let's celebrate! together with the golden orchestra. [Play now!](http://tyt2y3.github.com/celebrate)

## how to play
 - When not started, press keys on the keyboard according to the labels.
 - When started, use `v`,`b` and `space` to hit the incoming bits.
 - you can append `?HTML5` (upper case) to the end of url to switch to HTML5 audio backend. default backend is flash via SoundManager2.
 - `p` can pause the game

## how to hack
This project comes with a modest but powerful [beat composer](http://tyt2y3.github.com/celebrate/src/editor.html).
This composer can be easily configured to support other music instrument sounds. This code base is a generic framework for any rhythm game.

## add you own music into [composer](http://tyt2y3.github.com/celebrate/src/editor.html)
First you need to run your music in an analyzer to extract the waveform of the music. A simple [analyzer](http://tyt2y3.github.com/celebrate/demo/analyzer.html) is provided but only runs in Firefox. Then click `open music` in composer and specify the waveform file (in JSONP) and music file (in mp3,ogg or wav).
	> subject to cross origin resource limitation, it may or may not work if you load a file on other domains.
	> This repository is not a suitable place to host copyrighted material for you.

## architectural components

### drumset.js
[example](http://tyt2y3.github.com/celebrate/src/drumset.html)
`drumset` binds data to HTML. the reason is the individual `div`s can be styled freely via CSS.
```
<div id='drumset'>
	<div id='dr' key='r' sound='china1' radius='35' img='drum.png'>r</div>
</div>
```
attributes
- `key` the keyboard key to 'beat' the drum. can also beat the drum by mouseclick
- `sound` can provide file extension but it is recommended not to. drumset will try the extensions `.mp3` and `.ogg`. the reason is some HTML5 audio implementations (notably Firefox) do not support mp3 (intentionally).
- `radius`, `width` and `height`
- `color` background color
- `img` image

### drum.js
individual drum elements, created by `drumset`.

### chart.js
`chart` is a class that accepts JSON beat data and run and render the beats on an HTML element.
it is used by `game`. some config options:
```
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
	//,,,more
```

### musician.js
`musician` fullfill the visual functionality of a drum element. a `musician` contains a sprite that will play an animation when being `hit`.
`Mgroup` is a group of musicians. they are the groups you see in [example2](http://tyt2y3.github.com/celebrate/src/iconset.html).

## samples
[`analyzer.html`](http://tyt2y3.github.com/celebrateanalyzer.html)	[`SM2_player.html`](http://tyt2y3.github.com/celebrateSM2_player.html)	[`buzz_player.html`](http://tyt2y3.github.com/celebratebuzz_player.html)	[`sugar.html`](http://tyt2y3.github.com/celebratesugar.html)	[`waveform.html`](http://tyt2y3.github.com/celebratewaveform.html)	[`filesave.html`](http://tyt2y3.github.com/celebratefilesave.html)	[`waveform-player.html`](http://tyt2y3.github.com/celebratewaveform-player.html)	[`editor.html`](http://tyt2y3.github.com/celebrateeditor.html)	[`drumset.html`](http://tyt2y3.github.com/celebratedrumset.html)	[`game.html`](http://tyt2y3.github.com/celebrategame.html)	[`iconset.html`](http://tyt2y3.github.com/celebrateiconset.html)	[`iconset2.html`](http://tyt2y3.github.com/celebrateiconset2.html)	[`shapes.html`](http://tyt2y3.github.com/celebrateshapes.html)	[`index.html`](http://tyt2y3.github.com/celebrateindex.html)	[`game.html`](http://tyt2y3.github.com/celebrategame.html)	

## Project F
<img src="http://2.bp.blogspot.com/-k-My1B-YlaU/T8JUBAYpu9I/AAAAAAAAACI/OnCvkzFF5jw/s1600/logo_l1_s.png" height="80"/>
celebrate is a member of [Project F](http://tyt2y3.github.com/F.core) games.

## License
[License of Project F](http://project--f.blogspot.hk/2012/05/license.html). In short, everything except commercial use is allowed.
