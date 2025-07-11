import {
	type IExecuteFunctions,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestMethods,
	NodeConnectionTypes,
} from 'Digital Uprisers-workflow';

import { isoCountryCodes } from '@utils/ISOCountryCodes';

import { spotifyApiRequest, spotifyApiRequestAllItems } from './GenericFunctions';

export class Spotify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Spotify',
		name: 'spotify',
		icon: 'file:spotify.svg',
		group: ['input'],
		version: 1,
		description: 'Access public song data via the Spotify API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Spotify',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'spotifyOAuth2Api',
				required: true,
			},
		],
		properties: [
			// ----------------------------------------------------------------
			//         Resource to Operate on
			//         Album, Artist, Library, My Data, Player, Playlist, Track
			// ----------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Album',
						value: 'album',
					},
					{
						name: 'Artist',
						value: 'artist',
					},
					{
						name: 'Library',
						value: 'library',
					},
					{
						name: 'My Data',
						value: 'myData',
					},
					{
						name: 'Player',
						value: 'player',
					},
					{
						name: 'Playlist',
						value: 'playlist',
					},
					{
						name: 'Track',
						value: 'track',
					},
				],
				default: 'player',
			},

			// --------------------------------------------------------------------------------------------------------
			//         Player Operations
			//         Pause, Play, Resume, Get Recently Played, Get Currently Playing, Next Song, Previous Song,
			//         Add to Queue, Set Volume
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['player'],
					},
				},
				options: [
					{
						name: 'Add Song to Queue',
						value: 'addSongToQueue',
						description: 'Add a song to your queue',
						action: 'Add a song to a queue',
					},
					{
						name: 'Currently Playing',
						value: 'currentlyPlaying',
						description: 'Get your currently playing track',
						action: 'Get the currently playing track',
					},
					{
						name: 'Next Song',
						value: 'nextSong',
						description: 'Skip to your next track',
						action: 'Skip to the next track',
					},
					{
						name: 'Pause',
						value: 'pause',
						description: 'Pause your music',
						action: 'Pause the player',
					},
					{
						name: 'Previous Song',
						value: 'previousSong',
						description: 'Skip to your previous song',
						action: 'Skip to the previous song',
					},
					{
						name: 'Recently Played',
						value: 'recentlyPlayed',
						description: 'Get your recently played tracks',
						action: 'Get the recently played tracks',
					},
					{
						name: 'Resume',
						value: 'resume',
						description: 'Resume playback on the current active device',
						action: 'Resume the player',
					},
					{
						name: 'Set Volume',
						value: 'volume',
						description: 'Set volume on the current active device',
						action: 'Set volume on the player',
					},
					{
						name: 'Start Music',
						value: 'startMusic',
						description: 'Start playing a playlist, artist, or album',
						action: 'Start music on the player',
					},
				],
				default: 'addSongToQueue',
			},
			{
				displayName: 'Resource ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['startMusic'],
					},
				},
				placeholder: 'spotify:album:1YZ3k65Mqw3G8FzYlW1mmp',
				description: 'Enter a playlist, artist, or album URI or ID',
			},
			{
				displayName: 'Track ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['addSongToQueue'],
					},
				},
				placeholder: 'spotify:track:0xE4LEFzSNGsz1F6kvXsHU',
				description: 'Enter a track URI or ID',
			},

			// -----------------------------------------------
			//         Album Operations
			//         Get an Album, Get an Album's Tracks
			// -----------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['album'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an album by URI or ID',
						action: 'Get an album',
					},
					{
						name: 'Get New Releases',
						value: 'getNewReleases',
						description: 'Get a list of new album releases',
						action: 'Get new album releases',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: "Get an album's tracks by URI or ID",
						action: "Get an album's tracks by URI or ID",
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search albums by keyword',
						action: 'Search albums by keyword',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Album ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['get', 'getTracks'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: 'spotify:album:1YZ3k65Mqw3G8FzYlW1mmp',
				description: "The album's Spotify URI or ID",
			},
			{
				displayName: 'Search Keyword',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['search'],
					},
				},
			},

			// -------------------------------------------------------------------------------------------------------------
			//         Artist Operations
			//         Get an Artist, Get an Artist's Related Artists, Get an Artist's Top Tracks, Get an Artist's Albums
			// -------------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['artist'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an artist by URI or ID',
						action: 'Get an artist',
					},
					{
						name: 'Get Albums',
						value: 'getAlbums',
						description: "Get an artist's albums by URI or ID",
						action: "Get an artist's albums by URI or ID",
					},
					{
						name: 'Get Related Artists',
						value: 'getRelatedArtists',
						description: "Get an artist's related artists by URI or ID",
						action: "Get an artist's related artists by URI or ID",
					},
					{
						name: 'Get Top Tracks',
						value: 'getTopTracks',
						description: "Get an artist's top tracks by URI or ID",
						action: "Get an artist's top tracks by URI or ID",
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search artists by keyword',
						action: 'Search artists by keyword',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Artist ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['artist'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: 'spotify:artist:4LLpKhyESsyAXpc4laK94U',
				description: "The artist's Spotify URI or ID",
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'US',
				required: true,
				displayOptions: {
					show: {
						resource: ['artist'],
						operation: ['getTopTracks'],
					},
				},
				placeholder: 'US',
				description: 'Top tracks in which country? Enter the postal abbreviation',
			},

			{
				displayName: 'Search Keyword',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['artist'],
						operation: ['search'],
					},
				},
			},

			// -------------------------------------------------------------------------------------------------------------
			//         Playlist Operations
			//         Get a Playlist, Get a Playlist's Tracks, Add/Remove a Song from a Playlist, Get a User's Playlists
			// -------------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
					},
				},

				options: [
					{
						name: 'Add an Item',
						value: 'add',
						description: 'Add tracks to a playlist by track and playlist URI or ID',
						action: 'Add an Item to a playlist',
					},
					{
						name: 'Create a Playlist',
						value: 'create',
						description: 'Create a new playlist',
						action: 'Create a playlist',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a playlist by URI or ID',
						action: 'Get a playlist',
					},
					{
						name: "Get the User's Playlists",
						value: 'getUserPlaylists',
						description: "Get a user's playlists",
						action: "Get a user's playlists",
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: "Get a playlist's tracks by URI or ID",
						action: "Get a playlist's tracks by URI or ID",
					},
					{
						name: 'Remove an Item',
						value: 'delete',
						description: 'Remove tracks from a playlist by track and playlist URI or ID',
						action: 'Remove an item from a playlist',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search playlists by keyword',
						action: 'Search playlists by keyword',
					},
				],
				default: 'add',
			},
			{
				displayName: 'Playlist ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add', 'delete', 'get', 'getTracks'],
					},
				},
				placeholder: 'spotify:playlist:37i9dQZF1DWUhI3iC1khPH',
				description: "The playlist's Spotify URI or its ID",
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['create'],
					},
				},
				placeholder: 'Favorite Songs',
				description: 'Name of the playlist to create',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						placeholder: 'These are all my favorite songs.',
						description: 'Description for the playlist to create',
					},
					{
						displayName: 'Public',
						name: 'public',
						type: 'boolean',
						default: true,
						description: 'Whether the playlist is publicly accessible',
					},
				],
			},
			{
				displayName: 'Track ID',
				name: 'trackID',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add', 'delete'],
					},
				},
				placeholder: 'spotify:track:0xE4LEFzSNGsz1F6kvXsHU',
				description:
					"The track's Spotify URI or its ID. The track to add/delete from the playlist.",
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add'],
					},
				},
				options: [
					{
						displayName: 'Position',
						name: 'position',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						placeholder: '0',
						description: "The new track's position in the playlist",
					},
				],
			},
			{
				displayName: 'Search Keyword',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['search'],
					},
				},
			},

			// -----------------------------------------------------
			//         Track Operations
			//         Get a Track, Get a Track's Audio Features
			// -----------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['track'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a track by its URI or ID',
						action: 'Get a track',
					},
					{
						name: 'Get Audio Features',
						value: 'getAudioFeatures',
						description: 'Get audio features for a track by URI or ID',
						action: 'Get audio features of a track',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
					},
				],
				default: 'track',
			},
			{
				displayName: 'Track ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['track'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: 'spotify:track:0xE4LEFzSNGsz1F6kvXsHU',
				description: "The track's Spotify URI or ID",
			},
			{
				displayName: 'Search Keyword',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['track'],
						operation: ['search'],
					},
				},
			},

			// -----------------------------------------------------
			//         Library Operations
			//         Get liked tracks
			// -----------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['library'],
					},
				},
				options: [
					{
						name: 'Get Liked Tracks',
						value: 'getLikedTracks',
						description: "Get the user's liked tracks",
						action: 'Get liked tracks',
					},
				],
				default: 'getLikedTracks',
			},

			// ---------------------------------------
			//         My Data Operations
			//         Get Followed Artists
			// ---------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['myData'],
					},
				},
				options: [
					{
						name: 'Get Following Artists',
						value: 'getFollowingArtists',
						description: 'Get your followed artists',
						action: 'Get your followed artists',
					},
				],
				default: 'getFollowingArtists',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'library', 'myData', 'playlist', 'track', 'player'],
						operation: [
							'getTracks',
							'getAlbums',
							'getUserPlaylists',
							'getNewReleases',
							'getLikedTracks',
							'getFollowingArtists',
							'search',
							'recentlyPlayed',
						],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'library', 'playlist', 'track'],
						operation: [
							'getTracks',
							'getAlbums',
							'getUserPlaylists',
							'getNewReleases',
							'getLikedTracks',
							'search',
						],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['myData', 'player'],
						operation: ['getFollowingArtists', 'recentlyPlayed'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Volume',
				name: 'volumePercent',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['volume'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				description: 'The volume percentage to set',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['getNewReleases'],
					},
				},
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'options',
						default: 'US',
						options: isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
						description: 'Country to filter new releases by',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist', 'artist', 'track', 'album'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Country',
						name: 'market',
						type: 'options',
						options: isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
						default: '',
						description:
							'If a country code is specified, only content that is playable in that market is returned',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all of the incoming input data to loop through
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For Post
		const body: IDataObject = {};
		// For Query string
		let qs: IDataObject;

		let requestMethod: IHttpRequestMethods;
		let endpoint: string;
		let returnAll: boolean;
		let propertyName = '';
		let responseData;

		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);

		// Set initial values
		requestMethod = 'GET';
		endpoint = '';
		qs = {};
		returnAll = false;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'player') {
					// -----------------------------
					//      Player Operations
					// -----------------------------

					if (operation === 'pause') {
						requestMethod = 'PUT';

						endpoint = '/me/player/pause';

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'recentlyPlayed') {
						requestMethod = 'GET';

						endpoint = '/me/player/recently-played';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'currentlyPlaying') {
						requestMethod = 'GET';

						endpoint = '/me/player/currently-playing';

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'nextSong') {
						requestMethod = 'POST';

						endpoint = '/me/player/next';

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'previousSong') {
						requestMethod = 'POST';

						endpoint = '/me/player/previous';

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'startMusic') {
						requestMethod = 'PUT';

						endpoint = '/me/player/play';

						const id = this.getNodeParameter('id', i) as string;

						body.context_uri = id;

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'addSongToQueue') {
						requestMethod = 'POST';

						endpoint = '/me/player/queue';

						const id = this.getNodeParameter('id', i) as string;

						qs = {
							uri: id,
						};

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'resume') {
						requestMethod = 'PUT';

						endpoint = '/me/player/play';

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'volume') {
						requestMethod = 'PUT';

						endpoint = '/me/player/volume';

						const volumePercent = this.getNodeParameter('volumePercent', i) as number;

						qs = {
							volume_percent: volumePercent,
						};

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					}
				} else if (resource === 'album') {
					// -----------------------------
					//      Album Operations
					// -----------------------------

					if (operation === 'get') {
						const uri = this.getNodeParameter('id', i) as string;

						const id = uri.replace('spotify:album:', '');

						requestMethod = 'GET';

						endpoint = `/albums/${id}`;

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'getNewReleases') {
						endpoint = '/browse/new-releases';
						requestMethod = 'GET';
						propertyName = 'albums.items';

						const filters = this.getNodeParameter('filters', i);

						if (Object.keys(filters).length) {
							Object.assign(qs, filters);
						}

						returnAll = this.getNodeParameter('returnAll', i);

						if (!returnAll) {
							qs.limit = this.getNodeParameter('limit', i);
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.albums.items;
						}
					} else if (operation === 'getTracks') {
						const uri = this.getNodeParameter('id', i) as string;

						const id = uri.replace('spotify:album:', '');

						requestMethod = 'GET';

						endpoint = `/albums/${id}/tracks`;

						propertyName = 'tracks';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'albums.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'album',
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.albums.items;
						}
					}
				} else if (resource === 'artist') {
					// -----------------------------
					//      Artist Operations
					// -----------------------------

					const uri = this.getNodeParameter('id', i, '') as string;

					const id = uri.replace('spotify:artist:', '');

					if (operation === 'getAlbums') {
						endpoint = `/artists/${id}/albums`;

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'getRelatedArtists') {
						endpoint = `/artists/${id}/related-artists`;

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = responseData.artists;
					} else if (operation === 'getTopTracks') {
						const country = this.getNodeParameter('country', i) as string;

						qs = {
							country,
						};

						endpoint = `/artists/${id}/top-tracks`;

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = responseData.tracks;
					} else if (operation === 'get') {
						requestMethod = 'GET';

						endpoint = `/artists/${id}`;

						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'artists.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							limit: 50,
							type: 'artist',
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.artists.items;
						}
					}
				} else if (resource === 'playlist') {
					// -----------------------------
					//      Playlist Operations
					// -----------------------------

					if (['delete', 'get', 'getTracks', 'add'].includes(operation)) {
						const uri = this.getNodeParameter('id', i) as string;

						const id = uri.replace('spotify:playlist:', '');

						if (operation === 'delete') {
							requestMethod = 'DELETE';
							const trackId = this.getNodeParameter('trackID', i) as string;

							body.tracks = [
								{
									uri: trackId,
								},
							];

							endpoint = `/playlists/${id}/tracks`;

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = { success: true };
						} else if (operation === 'get') {
							requestMethod = 'GET';

							endpoint = `/playlists/${id}`;

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
						} else if (operation === 'getTracks') {
							requestMethod = 'GET';

							endpoint = `/playlists/${id}/tracks`;

							returnAll = this.getNodeParameter('returnAll', i);

							propertyName = 'items';

							if (!returnAll) {
								const limit = this.getNodeParameter('limit', i);

								qs = {
									limit,
								};

								responseData = await spotifyApiRequest.call(
									this,
									requestMethod,
									endpoint,
									body,
									qs,
								);

								responseData = responseData.items;
							}
						} else if (operation === 'add') {
							requestMethod = 'POST';

							const trackId = this.getNodeParameter('trackID', i) as string;
							const additionalFields = this.getNodeParameter('additionalFields', i);

							qs = {
								uris: trackId,
							};

							if (additionalFields.position !== undefined) {
								qs.position = additionalFields.position;
							}

							endpoint = `/playlists/${id}/tracks`;

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
						}
					} else if (operation === 'getUserPlaylists') {
						requestMethod = 'GET';

						endpoint = '/me/playlists';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'create') {
						// https://developer.spotify.com/console/post-playlists/

						body.name = this.getNodeParameter('name', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i);

						if (Object.keys(additionalFields).length) {
							Object.assign(body, additionalFields);
						}

						responseData = await spotifyApiRequest.call(this, 'POST', '/me/playlists', body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'playlists.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'playlist',
							limit: 50,
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.playlists.items;
						}
					}
				} else if (resource === 'track') {
					// -----------------------------
					//      Track Operations
					// -----------------------------

					const uri = this.getNodeParameter('id', i, '') as string;

					const id = uri.replace('spotify:track:', '');

					requestMethod = 'GET';

					if (operation === 'getAudioFeatures') {
						endpoint = `/audio-features/${id}`;
						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'get') {
						endpoint = `/tracks/${id}`;
						responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'tracks.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'track',
							limit: 50,
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.tracks.items;
						}
					}
				} else if (resource === 'library') {
					// -----------------------------
					//      Library Operations
					// -----------------------------

					if (operation === 'getLikedTracks') {
						requestMethod = 'GET';

						endpoint = '/me/tracks';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					}
				} else if (resource === 'myData') {
					if (operation === 'getFollowingArtists') {
						requestMethod = 'GET';

						endpoint = '/me/following';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'artists.items';

						qs = {
							type: 'artist',
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs = {
								type: 'artist',
								limit,
							};
							responseData = await spotifyApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.artists.items;
						}
					}
				}

				if (returnAll) {
					responseData = await spotifyApiRequestAllItems.call(
						this,
						propertyName,
						requestMethod,
						endpoint,
						body,
						qs,
					);
				}

				// Remove null values from the response
				if (operation === 'getUserPlaylists') {
					responseData = responseData.filter((item: IDataObject) => item !== null);
				}
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
