'use strict';

/* global helpers */

module.exports.shouldLoad = function(driver, url, done, loadOpts) {
	var pageLoad = true;
	var loadTimeout = loadOpts ? loadOpts.timeout : null;

	if(url) {
		// /*#*/ console.log("Loading "+url);
		pageLoad = false;
		helpers.getAndWait(driver, url, loadTimeout)
		.then(function() {
			// console.log("LOADED "+url)
			pageLoad = true;
		})
		.thenCatch(function() {
			return done(new Error('Driver timeout!'));
		});
	}

	driver.wait(function() { return pageLoad; })
	.then(function() {
		helpers.alertCheck(driver).then(function() {
			// console.log('Alert check done!\nStarting waitforload');
			helpers.waitForLoad(driver, loadTimeout)
			.then(function() {
				// console.log('Wait for load done!\nInjecting test capture.');
				helpers.injectTestCapture(driver).then(function() {
					helpers.waitForExtensionLoad(driver, {count: 0})
					.then(function(result) {
						// /*#*/ console.info('		Extension loaded!');
						//expect(result).to.be.true;
						if(!result) {
							return done(new Error('Extension load error!'));
						}
						// cb();
						done();
					}, function(err) {
						// /*#*/ console.warn('Extension error: ', err);
						return done(err);
					});
				});
			}, function(err) {
				// /*#*/ console.warn('Driver Timeout!', err);
				return done(err);
			});
		});
	});
};
