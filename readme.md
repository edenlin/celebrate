# Celebrate
![screenshot](http://tyt2y3.github.com/celebrate/web/image/cap01.png)
Let's celebrate! together with the golden orchestra. [Play now!](http://tyt2y3.github.com/celebrate)

## how to play
 - When not started, press keys on the keyboard according to the labels.
 - When started, use `v`,`b` and `space` to hit the incoming bits.
 - you can append `?HTML5` (upper case) to the end of url to switch to HTML5 audio backend. default backend is flash via SoundManager2.
 - `p` can pause the game

## beat composer
This project comes with a modest but powerful [beat composer](http://tyt2y3.github.com/celebrate/src/editor.html).
![beat composer](http://tyt2y3.github.com/celebrate/web/image/editor.png)

### features
- seeking on time line
- live recording and playback of beat sequences
- fine tune beat position by mouse
- add, move or delete lyrics

	> while dragging a lyrics or beat element, press `d` on keyboard to delete.
- layers: beat sequences are recorded to a new layer each time, and that layer can be deleted if it is unsatisfying.

	> tick the checkbox of the layer and a button `delete layer` will appear.
- autosave current editing work

### changing the drum set
modification of the drum set is done by editing the HTML section of `editor.html`. find the section
```
<div id='drumset'>
	<div id='dr' key='r' sound='AMB_HTM' radius='35' img='drum.png'><br>&nbsp;&nbsp;&nbsp;r</div>
	<div id='dt' key='t' sound='AMB_MTM' radius='40' img='drum.png'><br>&nbsp;&nbsp;&nbsp;t</div>
	<div id='dy' key='y' sound='AMB_FTM2' radius='40' img='drum.png'><br>&nbsp;&nbsp;&nbsp;y</div>
	<div id='du' key='u' sound='AMB_LTM2' radius='55' img='drum.png'>&nbsp;u</div>
...
```
which follows the format of [drumset.js](#drumsetjs), see [drumset.html](http://tyt2y3.github.com/celebrate/src/drumset.html) for example.

### add you own music into [composer](http://tyt2y3.github.com/celebrate/src/editor.html)
- First you need to run your music in an analyzer to extract the waveform of the music.
- A simple [analyzer](http://tyt2y3.github.com/celebrate/demo/analyzer.html) is provided but only runs in Firefox.
- Then click `open music` in composer and specify the waveform file (in JSONP) and music file (in mp3,ogg or wav).

> subject to cross origin resource limitation, it may or may not work if you load a file from other domains.
> which means you can either work on a local file system or host the entire application on your server for other users.
> This repository is not a suitable place to host copyrighted material for you.

## development

This code base is a generic framework for any rhythm game. This is not a full-featured game engine though, but will be a good starting point for you to create your own rhythm game. It is already the best I can offer for free with my limited time.

### Toolchains
__celebrate__ is built with the best practices in web application development, including versioning control, compile-free rapid development, compile-time scripts optimization and automatic build process. So you'll need to be familiar with these tools (luckily, they are not hard to learn).

- an up-to-date browser
- [git](http://git-scm.com/)
- [node.js](http://nodejs.org/)
- [F.core repository](https://github.com/tyt2y3/F.core) install with celebrate side by side, the folder must be named `F.core`

> something like
> ```
> F/
>	F.core/
>	celebrate/
> ```

If you download the repository to local space, the default SoundManager2 will not work because of security. read [details here](http://www.schillmania.com/projects/soundmanager2/doc/getstarted/) in the Live Debug Output session, or a quote:
- If loading from the local filesystem (offline eg. file://, not over HTTP), Flash security is likely preventing SM2 from talking to Javascript. You will need to add this project's directory to the trusted locations in the [Flash global security settings panel](http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html), or simply view this page over HTTP.

HTML5 backend doesnt have this problem. append `?HTML5` to url, like `editor.html?HTML5`.

### Components

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

### samples
[`editor.html`](http://tyt2y3.github.com/celebrate/src/editor.html)	[`drumset.html`](http://tyt2y3.github.com/celebrate/src/drumset.html)	[`game.html`](http://tyt2y3.github.com/celebrate/src/game.html)	[`iconset.html`](http://tyt2y3.github.com/celebrate/src/iconset.html)	[`iconset2.html`](http://tyt2y3.github.com/celebrate/src/iconset2.html)	[`shapes.html`](http://tyt2y3.github.com/celebrate/src/shapes.html)	
[`analyzer.html`](http://tyt2y3.github.com/celebrate/demo/analyzer.html)	[`SM2_player.html`](http://tyt2y3.github.com/celebrate/demo/SM2_player.html)	[`buzz_player.html`](http://tyt2y3.github.com/celebrate/demo/buzz_player.html)	[`sugar.html`](http://tyt2y3.github.com/celebrate/demo/sugar.html)	[`waveform.html`](http://tyt2y3.github.com/celebrate/demo/waveform.html)	[`filesave.html`](http://tyt2y3.github.com/celebrate/demo/filesave.html)	[`waveform-player.html`](http://tyt2y3.github.com/celebrate/demo/waveform-player.html)	

## Acknowledgements

### idea and sprites
I did not invent the game. the game mode refers to a famous rhythm game Taiko. the icons are from [HKGolden](http://forum.hkgolden.com) which in turn derive its icons from an old forum distribution. the idea of all these icons playing together in a celebration is a classic.

### drum sounds
the drum sounds are from [Acoustic drumkit example sounds](http://www.akaipro.com/)

### libraries
__celebrate__ is built upon the following javascript libraries:

- file saver
	- BlobBuilder.js
	- FileSaver.js
- persistent storage
	- persist-min.js
- module loaders
	- head.load.min.js
	- require.js, r.js
- audio
	- buzz.js
	- soundmanager2-nodebug-jsmin.js
- array extensions
	- sugar-1.3.8-custom.min.js
- sprite animation
	- [F.core](https://github.com/tyt2y3/F.core)

## Project F
<img src="http://2.bp.blogspot.com/-k-My1B-YlaU/T8JUBAYpu9I/AAAAAAAAACI/OnCvkzFF5jw/s1600/logo_l1_s.png" height="80"/>
celebrate is a member of [Project F games](http://project--f.blogspot.com/2013/02/games.html).

### License
[License of Project F](http://project--f.blogspot.hk/2012/05/license.html). In short, everything except commercial use is allowed.
