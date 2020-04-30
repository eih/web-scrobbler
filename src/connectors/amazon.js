'use strict';

const optionBtnSelector = '.buttonOption.main[title=Options]';

Connector.playerSelector = '#dragonflyTransport .rightSide';

Connector.getArtist = () => {
	// FIXME Use unified selector
	return Util.getAttrFromSelectors([
		'.trackInfoContainer .trackArtist a',
		'.trackInfoContainer .trackArtist span',
	], 'title');
};

Connector.getAlbumArtist = Connector.getArtist;

Connector.trackSelector = '.trackInfoContainer .trackTitle';

Connector.getAlbum = () => {
	const sourceLink = document.querySelector('.trackSourceLink a');
	if (sourceLink) {
		const sourceLinkUrl = sourceLink.getAttribute('href');
		if (sourceLinkUrl && sourceLinkUrl.includes('albums')) {
			return sourceLink.textContent;
		}
	}

	const albumCellTitle = Util.getAttrFromSelectors('tr.selectable.currentlyPlaying td.albumCell', 'title');
	if (albumCellTitle) {
		return albumCellTitle;
	}

	const albumImageTitle = Util.getAttrFromSelectors('.nowPlayingDetail img.albumImage', 'title');
	if (albumImageTitle) {
		return albumImageTitle;
	}

	if (sourceLink) {
		const clickAction = sourceLink.getAttribute('data-ui-click-action');
		if (clickAction === 'selectAlbum') {
			return sourceLink.getAttribute('title');
		}
	}

	return null;
};

Connector.currentTimeSelector = '.songDuration.timeElapsed';

Connector.playButtonSelector = '.rightSide .playbackControls .playerIconPlay';

Connector.durationSelector = '#currentDuration';

Connector.trackArtSelector = '.rightSide .albumArtWrapper img';

Connector.getUniqueID = () => {
	const optionsHref = Util.getAttrFromSelectors(optionBtnSelector, 'href');
	return optionsHref && optionsHref.replace(/[\W\w]+adriveId=/, '');
};

Connector.applyFilter(MetadataFilter.getAmazonFilter());
