(function(){
	'user-strict';

	angular.module('democracy-direct').config(function($mdThemingProvider) {
		var ddBlueAccent = {
        '50': '#94ddfc',
        '100': '#7bd5fc',
        '200': '#63cdfb',
        '300': '#4ac5fa',
        '400': '#31bdfa',
        '500': '#18B5F9',
        '600': '#06aaf1',
        '700': '#0699d8',
        '800': '#0587bf',
        '900': '#0476a7',
        'A100': '#ade5fd',
        'A200': '#c6edfe',
        'A400': '#dff5fe',
        'A700': '#04648e',
		'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    	'contrastDarkColors': ['50', '100','200', '300', '400', 'A100'],
    	'contrastLightColors': undefined
    };
    $mdThemingProvider
        .definePalette('ddBlueAccent',
                        ddBlueAccent);

	$mdThemingProvider.theme('default').primaryPalette('grey', {
			'default': '50', // by default use shade 400 from the pink palette for primary intentions
			'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
			'hue-2': '400', // use shade 600 for the <code>md-hue-2</code> class
			'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
		}).backgroundPalette('grey', {
			'default': '50', // by default use shade 400 from the pink palette for primary intentions
			'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
			'hue-2': '200', // use shade 600 for the <code>md-hue-2</code> class
			'hue-3': '300' // use shade A100 for the <code>md-hue-3</code> class
		}).accentPalette('ddBlueAccent',{
			'default': '400', // by default use shade 400 from the pink palette for primary intentions
			'hue-1': '500', // use shade 100 for the <code>md-hue-1</code> class
			'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
			'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
		}).warnPalette('pink');
	$mdThemingProvider.alwaysWatchTheme(true);

});

})()
