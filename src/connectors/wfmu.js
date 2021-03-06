'use strict';

/*
 * This connector covers archived tracks only. A `radiorethink` connector
 * is used to get track info from WFMU main streams.
 */

const filter = new MetadataFilter({
	track: cleanupTrack
});

Connector.playerSelector = '.archiveplayer';

Connector.artistSelector = '#np-artist';

Connector.trackSelector = '#np-song';

Connector.playButtonSelector = '.mejs-play';

Connector.applyFilter(filter);

function cleanupTrack(track) {
	// Extract a track title from a `"Track" by Artist` string.
	return track.replace(/(")(.*)(")( by )(.*)/g, '$2');
}
