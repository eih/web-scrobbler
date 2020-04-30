'use strict';

const artistTrackSelector = '.cPlay meta[itemprop="name"]';

const mixDuration = getMixDuration();

Connector.playerSelector = '#playerWidget';

Connector.trackArtSelector = '#artworkLeft';

Connector.albumSelector = '#pageTitle';

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors('.cPlay', 'id');
};

Connector.getArtistTrack = () => {
	const text = Util.getAttrFromSelectors(artistTrackSelector, 'content');
	return Util.splitArtistTrack(text);
};

Connector.getTimeInfo = () => {
	const trackEndTime = getTrackEndTime();
	const trackStartTime = getTrackStartTime();
	const globalCurrentTime = getGlobalCurrentTime();

	const currentTime = globalCurrentTime - trackStartTime;
	const duration = trackEndTime - trackStartTime;

	return { currentTime, duration };
};

Connector.playButtonSelector = '#playerWidgetPause.fa-play';

Connector.isScrobblingAllowed = () => {
	return !isNoIdTrack();
};

function getGlobalCurrentTime() {
	return Util.getSecondsFromSelectors('#playerWidgetCurrentTime');
}

function getTrackStartTime() {
	return Util.getSecondsFromSelectors('.cPlay .cueValueField');
}

function getTrackEndTime() {
	let container = document.querySelector('.cPlay');
	if (!container) {
		return 0;
	}

	// eslint-disable-next-line no-cond-assign
	while (container = container.nextElementSibling) {
		if (!container.classList.contains('topBorder')) {
			continue;
		}

		const startTimeElement = container.querySelector('.cueValueField');
		if (!startTimeElement) {
			continue;
		}

		const startTime = Util.stringToSeconds(startTimeElement.textContent);
		if (startTime > 0) {
			return startTime;
		}
	}

	return mixDuration;
}

function getMixDuration() {
	const mediaInfo = Util.getTextFromSelectors('.mediaTabItem span');
	if (mediaInfo) {
		const timeInfoMatch = mediaInfo.match(/\[(.+?)]/);
		if (timeInfoMatch) {
			return Util.stringToSeconds(timeInfoMatch[1]);
		}
	}

	return 0;
}

function isNoIdTrack() {
	const container = document.querySelector('.cPlay');
	return container && container.querySelector('.trackFormat .redTxt') !== null;
}
