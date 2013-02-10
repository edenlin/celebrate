/** a main() wrapper for iconset.js
 */
requirejs.config({
	baseUrl: '../../',
	paths: {
		'cele':'celebrate/src',
		'third_party':'celebrate/third_party'
	}
});
requirejs(['cele/iconset'],function()
{
});
