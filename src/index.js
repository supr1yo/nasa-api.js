const fetch = require('node-fetch');

/**
 * NASA API
 * @param {string} key - The API key which you get in https://api.nasa.gov/
 * @example
 * const NASAAPI = require('nasa-api.js');
 * const nasa = new NASAAPI('YourAPIKeyHere');
 */
class NASAAPI {
	constructor(key) {
		this.key = key;
	}

	/**
	 * GET Request to https://api.nasa.gov/
	 * @param {string} path - URL path
	 * @returns {Promise<any>} Object
	 */

	async fetch(path) {
		const res = await fetch(`https://api.nasa.gov/${path}api_key=${this.key}`).catch(() => null);
		const data = await res.json();
		return data;
	}

	// TO-DO: Add options
	async apod() {
		return this.fetch('planetary/apod?');
	}

	get neo() {
		return {
			feed: (startDate, endDate) => this.feed(startDate, endDate),
			lookup: asteroidID => this.lookup(asteroidID),
			browse: () => this.browse()
		};
	}
	/**
	 * Retrieve a list of Asteroids based on their closest approach date to Earth.
	 * @param {date} startDate - Starting date for asteroid search in YYYY-MM-DD format.
	 * @param {date} endDate - Ending date for asteroid search in YYYY-MM-DD format.
	 * @returns {Promise<any>} Object
	 */

	async feed(startDate, endDate) {
		return this.fetch(`neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&`);
	}

	/**
	 * Lookup a specific Asteroid based on its [NASA JPL small body (SPK-ID) ID](https://ssd.jpl.nasa.gov/sbdb_query.cgi)
	 * @param {number} asteroidID - Asteroid SPK-ID correlates to the NASA JPL small body
	 * @returns {Promise<any>} Object
	 */

	async lookup(asteroidID) {
		return this.fetch(`neo/rest/v1/neo/${asteroidID}?`);
	}

	/**
	 * Browse the overall Asteroid data-se
	 * @returns {JSON} JSON
	 */

	async browse() {
		return this.fetch('neo/rest/v1/neo/browse?');
	}

	get earth() {
		return {
			imagery: (lon, lat, date) => this.imagery(lon, lat, date),
			assets: (lon, lat, date, dim) => this.assets(lon, lat, date, dim)
		};
	}


	/**
	 * This endpoint retrieves the Landsat 8 image for the supplied location and date.
	 * @param {String} lon - Latitude
	 * @param {String} lat - Longitude
	 * @param {Date} date - date of image; if not supplied, then the most recent image (i.e., closest to today) is returned
	 * @returns {JSON} - JSON
	 */

	async imagery(lon, lat, date) {
		return this.fetch(`planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${date}&`);
	}

	/**
	 * This endpoint retrieves the date-times and asset names for closest available imagery for a supplied location and date.
	 * @param {String} lon - Longitude
	 * @param {String} lat - Latitude
	 * @param {Date} date - Beginning of 30 day date range that will be used to look for closest image to that date in YYYY-MM-DD format.
	 * @param {Number} dim - Width and height of image in degrees
	 * @returns JSON
	 */

	async assets(lon, lat, date, dim) {
		return this.fetch(`planetary/earth/assets?lon=${lon}&lat=${lat}&date=${date}&&dim=${dim}&`);
	}

	/**
	 * NASA’s InSight Mars lander takes continuous weather measurements (temperature, wind, pressure) on the surface of Mars at Elysium Planitia, a flat, smooth plain near Mars’ equator. Summaries of these data are available at https://mars.nasa.gov/insight/weather/.
	 * @param {Number} version - The version of this API
	 * @returns {JSON} JSON
	 */

	async insight(version) {
		if (typeof version !== 'number') throw new Error('Version should be a float.');
		return this.fetch(`insight_weather/?api_key=${this.key}&feedtype=json&ver=${version}`);
	}
	/**
	 * Use this API to access the NASA Image and Video Library site at [images.nasa.gov](https://images.nasa.gov/). For the latest documentation, please go [here](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf).
	 */

	get imageAndVideo() {
		return {
			search: query => this.search(query),
			asset: nasaID => this.asset(nasaID),
			metadata: nasaID => this.metadata(nasaID),
			captions: nasaID => this.captions(nasaID)

		};
	}
	/**
	 * Performing a search
	 * @param {String} query - Query.
	 * @returns JSON
	 */

	async search(query) {
		const res = await fetch(`https://images-api.nasa.gov/search?q=${query}`).catch(() => null);
		const data = await res.json();
		return data;
	}
	/**
	 * Retrieving a media asset’s manifest
	 * @param {String} nasaID - The media asset’s NASA ID.
	 * @returns JSON
	 */

	async asset(nasaID) {
		const res = await fetch(`https://images-api.nasa.gov/asset/${nasaID}`).catch(() => null);
		const data = await res.json();
		return data;
	}

	/**
	 * Retrieving a media asset’s metadata location
	 * @param {String} nasaID - The media asset’s NASA ID.
	 * @returns JSON
	 */

	async metadata(nasaID) {
		const res = await fetch(`https://images-api.nasa.gov/metadata/${nasaID}`).catch(() => null);
		const data = await res.json();
		return data;
	}
	/**
	 * Retrieving a video asset’s captions location
	 * @param {String} nasaID - The video asset’s NASA ID.
	 * @returns JSON
	 */

	async captions(nasaID) {
		const res = await fetch(`https://images-api.nasa.gov/captions/${nasaID}`).catch(() => null);
		const data = await res.json();
		return data;
	}

	/**
	 * This API can be used to export TechPort data into either an XML or a JSON format, which can then be further processed and analyzed. Complete documentation (in Swagger 2.0 format) of the available objects, properties, RESTful URIs is available in the online API specification at:
https://api.nasa.gov/techport/api/specification?api_key=DEMO_KEY.
	 * @param {Number} ID - The id value of the TechPort record. ID values can be obtained through the standard TechPort search feature and are visible in the website URLs, e.g. [http://techport.nasa.gov/view/0000](http://techport.nasa.gov/view/0000),
 where 0000 is the ID value. Alternatively, a request to /api/projects will display all valid IDs in the system.
	 * @returns JSON
	 */

	async techport(ID) {
		if (typeof ID !== 'number') throw new Error('The ID should be an integer.');
		return this.fetch(`techport/api/projects/${ID}?`);
	}
}

module.exports = NASAAPI;
