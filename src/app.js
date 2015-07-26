//Libraries
var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');

//Menus
var animeList;
var mangaList;
var profileGeneral;
var profileAnime;
var profileManga;
var friendsMenu;
var animeMenu;
var mangaMenu;
var detailedView;

//Art Window
var art;
var artLoadingText;
var artPage;

//Variables
var current_watch = {platform: "aplite"};
var profile = {"avatar_url":"http://cdn.myanimelist.net/images/na.gif","details":{"last_online":"Now","gender":"Unknown","birthday":"January  1, 1900","location":"City, Country","website":"http://example.com","join_date":"January 1, 1900","access_rank":"Member","anime_list_views":0,"manga_list_views":0,"forum_posts":0,"aim":null,"comments":0,"msn":null,"yahoo":null},"anime_stats":{"time_days":0,"watching":0,"completed":0,"on_hold":0,"dropped":0,"plan_to_watch":0,"total_entries":0},"manga_stats":{"time_days":0,"reading":0,"completed":0,"on_hold":0,"dropped":0,"plan_to_read":0,"total_entries":0}};
var friends = {};
var animeList;
var mode = 'anime';
var username = 'Default';
var id = '1';
var password = 'default';
var configSend = '';
var loggedIn = false;

//Temporary Login (for testing only)
//Settings.data('loggedIn', true);

//Utility functions
function strip_tags(input, allowed) {
	allowed = (((allowed || "") + "")
							.toLowerCase()
							.match(/<[a-z][a-z0-9]*>/g) || [])
	.join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1){
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}

//Initialize settings and stuff
function init() {
	console.log('Initializing...');
	if (Settings.data('loggedIn') === true) {
		loggedIn = true;
		username = Settings.data('username');
		id = Settings.data('id');
		password = Settings.data('password');
		configSend = '?username=' + username + '&password=' + password + '&id=' + id;
		
		//Download all dat data! (ajaxy stuff here)
		console.log('Let\'s ajax!');
		ajax({ url: 'https://api.atarashiiapp.com/profile/' + username, type: 'json' },
			function(data) {
				profile = data;
				
				//console.log('main data: ' + JSON.stringify(data, null, 4));
				
				ajax({ url: 'https://api.atarashiiapp.com/friends/' + username, type: 'json' },
					function(data) {
						friends = data;
						console.log('friends: ' + JSON.stringify(friends, null, 4));
					}
				);

				//Initialize the menus
				initMenus();
			}
		);
	} else {
		loggedIn = false;
		Settings.data('loggedIn', false);
		console.log('Eek! You\'re not logged in! You should probably login using the config window.');
	}
}

//DYNAMIC MENUS/UI ELEMENTS

//Initialize those dynamic menus. To be called after online request.
function initMenus() {
	console.log('Initializing those dynamic menus');
	//First, update the subtitles for the main menus
	animeMenu.item(0, 0, {title: 'My Profile', subtitle: 'Spent Days: ' + String(profile.anime_stats.time_days)});
	mangaMenu.item(0, 0, {title: 'My Profile', subtitle: 'Spent Days: ' + String(profile.manga_stats.time_days)});
	
	animeList = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'List',
			items: [{
				title: '(' + String(profile.anime_stats.watching) + ') Watching'
			}, {
				title: '(' + String(profile.anime_stats.completed) + ') Completed'
			}, {
				title: '(' + String(profile.anime_stats.on_hold) + ') On Hold'
			}, {
				title: '(' + String(profile.anime_stats.dropped) + ') Dropped'
			}, {
				title: '(' + String(profile.anime_stats.plan_to_watch) + ') Plan to Watch'
			}]
		}]
	});
	mangaList = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'List',
			items: [{
				title: '(' + String(profile.manga_stats.reading) + ') Reading'
			}, {
				title: '(' + String(profile.manga_stats.completed) + ') Completed'
			}, {
				title: '(' + String(profile.manga_stats.on_hold) + ') On Hold'
			}, {
				title: '(' + String(profile.manga_stats.dropped) + ') Dropped'
			}, {
				title: '(' + String(profile.manga_stats.plan_to_read) + ') Plan to Read'
			}]
		}]
	});
	profileGeneral = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'General',
			items: [{
				title: 'Username',
				subtitle: username
			}, {
				title: 'Gender',
				subtitle: profile.details.gender
			}, {
				title: 'Birthday',
				subtitle: profile.details.birthday
			}, {
				title: 'Location',
				subtitle: profile.details.location
			}, {
				title: 'Join Date',
				subtitle: profile.details.join_date
			}, {
				title: 'Access Rank',
				subtitle: profile.details.access_rank
			}, {
				title: 'Anime List Views',
				subtitle: String(profile.details.anime_list_views)
			}, {
				title: 'Manga List Views',
				subtitle: String(profile.details.manga_list_views)
			}, {
				title: 'Comments',
				subtitle: String(profile.details.comments)
			}]
		}]
	});
	profileAnime = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'Anime',
			items: [{
				title: 'Time (days)',
				subtitle: String(profile.anime_stats.time_days)
			}, {
				title: 'Watching',
				subtitle: String(profile.anime_stats.watching)
			}, {
				title: 'Completed',
				subtitle: String(profile.anime_stats.completed)
			}, {
				title: 'On Hold',
				subtitle: String(profile.anime_stats.on_hold)
			}, {
				title: 'Dropped',
				subtitle: String(profile.anime_stats.dropped)
			}, {
				title: 'Plan to Watch',
				subtitle: String(profile.anime_stats.plan_to_watch)
			}, {
				title: 'Total Entries',
				subtitle: String(profile.anime_stats.total_entries)
			}]
		}]
	});
	profileManga = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'Manga',
			items: [{
				title: 'Time (days)',
				subtitle: String(profile.manga_stats.time_days)
			}, {
				title: 'Reading',
				subtitle: String(profile.manga_stats.reading)
			}, {
				title: 'Completed',
				subtitle: String(profile.manga_stats.completed)
			}, {
				title: 'On Hold',
				subtitle: String(profile.manga_stats.on_hold)
			}, {
				title: 'Dropped',
				subtitle: String(profile.manga_stats.dropped)
			}, {
				title: 'Plan to Read',
				subtitle: String(profile.manga_stats.plan_to_read)
			}, {
				title: 'Total Entries',
				subtitle: String(profile.manga_stats.total_entries)
			}]
		}]
	});
	friendsMenu = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'cobaltBlue',
		highlightTextColor: 'white',
		sections: [{
			title: 'Friends (' + String(Object.keys(friends).length) + ')',
			items: [{
				title: 'No Friends'
			}]
		}]
	});
}

//Set the artwork to display for the current anime/manga. Takes one parameter: the artwork url. Will load color/b&w depending on platform.
function setArtwork(imageUrl) {
	var urlToUse;
	if (current_watch.platform == 'basalt') {
		urlToUse = 'http://floatingcube.web44.net/more/MAL_client/resize/?image=' + encodeURIComponent(imageUrl);
	} else {
		urlToUse = 'http://floatingcube.web44.net/more/MAL_client/dither/?image=' + encodeURIComponent(imageUrl);
	}
	art = new UI.Image({
		position: new Vector2(0, 0),
		size: new Vector2(144, 168),
		image: urlToUse
	});

	artLoadingText = new UI.Text({
		position: new Vector2(0, 50),
		size: new Vector2(144, 168),
		text:'Loading...',
		font:'GOTHIC_28',
		color:'white',
		textOverflow:'wrap',
		textAlign:'center'
	});

	artPage = new UI.Window({fullscreen: true});

	artPage.add(artLoadingText);
	artPage.add(art);
}

function openDetailedView(type, id) {
	ajax({ url: 'https://' + username + ':' + password + '@api.atarashiiapp.com/' + type + '/' + id + '?mine=1', type: 'json' },
		function(data) {
			//Get the alternate titles
			var otherTitles = [];
			if (data.other_titles.english != 'null') {
				otherTitles.push({
					title: 'English',
					subtitle: data.other_titles.english.join(", ")
				});
			}
			if (data.other_titles.japanese != 'null') {
				otherTitles.push({
					title: 'Japanese',
					subtitle: data.other_titles.japanese.join(", ")
				});
			}
			if (data.other_titles.synonyms != 'null') {
				otherTitles.push({
					title: 'Synonyms',
					subtitle: data.other_titles.synonyms.join(", ")
				});
			}

			//Define variable sections
			var anime_yourDetails;
			var manga_yourDetails;
			
			//Set variable sections
			if (type == 'anime') {
				if (data.watched_status === null) {
					anime_yourDetails = [{
						title: 'Add to list'
					}];
				} else {
					anime_yourDetails = [{
						title: 'Status',
						subtitle: data.watched_status
					}, {
						title: 'Watched',
						subtitle: data.watched_episodes + ' / ' + data.episodes
					}, {
						title: 'Score',
						subtitle: data.score
					}];
				}
			} else if (type == 'manga') {
				if (data.read_status === null) {
					manga_yourDetails = [{
						title: 'Add to list'
					}];
				} else {
					manga_yourDetails = [{
						title: 'Status',
						subtitle: data.read_status
					}, {
						title: 'Chapters read',
						subtitle: data.chapters_read + ' / ' + data.chapters
					}, {
						title: 'Volumes read',
						subtitle: data.volumes_read + ' / ' + data.volumes
					}, {
						title: 'Score',
						subtitle: data.score
					}];
				}
			}
			
			//Make the menu
			if (type == 'anime') {
				detailedView = new UI.Menu({
					backgroundColor: 'white',
					textColor: 'black',
					highlightBackgroundColor: 'cobaltBlue',
					highlightTextColor: 'white',
					sections: [{
						title: data.title,
						items: otherTitles
					}, {
						title: 'Your details',
						items: anime_yourDetails
					}, {
						title: 'Details',
						items: [{
							title: 'Synopsis',
							subtitle: strip_tags(data.synopsis)
						}, {
							title: 'Type',
							subtitle: data.type
						}, {
							title: 'Episodes',
							subtitle: data.episodes
						}, {
							title: 'Status',
							subtitle: data.status
						}, {
							title: 'Aired',
							subtitle: data.start_date + ' to ' + data.end_date
						}, {
							title: 'Score',
							subtitle: data.members_score
						}, {
							title: 'Rating',
							subtitle: data.classification
						}, {
							title: 'Genres',
							subtitle: data.genres.join(", ")
						}]
					}, {
						title: 'Statistics',
						items: [{
							title: 'Ranked',
							subtitle: '#' + data.rank
						}, {
							title: 'Popularity',
							subtitle: '#' + data.popularity_rank
						}, {
							title: 'Members',
							subtitle: data.members_count
						}, {
							title: 'Favorites',
							subtitle: data.favorited_count
						}]
					}]
				});
			} else if (type == 'manga') {
				detailedView = new UI.Menu({
					backgroundColor: 'white',
					textColor: 'black',
					highlightBackgroundColor: 'cobaltBlue',
					highlightTextColor: 'white',
					sections: [{
						title: data.title,
						items: otherTitles
					}, {
						title: 'Your details',
						items: manga_yourDetails
					}, {
						title: 'Details',
						items: [{
							title: 'Synopsis',
							subtitle: strip_tags(data.synopsis)
						}, {
							title: 'Type',
							subtitle: data.type
						}, {
							title: 'Volumes',
							subtitle: data.volumes
						}, {
							title: 'Chapters',
							subtitle: data.chapters
						}, {
							title: 'Status',
							subtitle: data.status
						}, {
							title: 'Score',
							subtitle: data.members_score
						}, {
							title: 'Genres',
							subtitle: data.genres.join(", ")
						}]
					}, {
						title: 'Statistics',
						items: [{
							title: 'Ranked',
							subtitle: '#' + data.rank
						}, {
							title: 'Popularity',
							subtitle: '#' + data.popularity_rank
						}, {
							title: 'Members',
							subtitle: data.members_count
						}, {
							title: 'Favorites',
							subtitle: data.favorited_count
						}]
					}]
				});
			}
			detailedView.show();
		}
	);
}

//STATIC MENUS/UI ELEMENTS

//Make that splash window!
var splash = new UI.Window();

var splashImage = new UI.Image({
  position: new Vector2(0, 15),
  size: new Vector2(144, 100),
  image:'images/logo.png'
});

var splashText = new UI.Text({
  position: new Vector2(0, 110),
  size: new Vector2(144, 168),
  text:'CLIENT',
  font:'GOTHIC_28',
  color:'cobaltBlue',
  textOverflow:'wrap',
  textAlign:'center'
});

var splashBackground = new UI.Rect({
	position: new Vector2(0, 0),
	size: new Vector2(144, 168),
	backgroundColor: 'white'
});

//Default menu in anime mode
animeMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'cobaltBlue',
  highlightTextColor: 'white',
  sections: [{
    title: 'Anime',
    items: [{
      title: 'My Profile',
			subtitle: 'Spent days: 0'
    }, {
      title: 'Switch to Manga'
    }, {
      title: 'List'
    }, {
      title: 'Anime'
    }, {
      title: 'Recent Anime'
    }, {
      title: 'Friends'
    }]
  }]
});

//Default menu in manga mode
mangaMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'cobaltBlue',
  highlightTextColor: 'white',
  sections: [{
    title: 'Manga',
    items: [{
      title: 'My Profile',
			subtitle: 'Spent days: 0'
    }, {
      title: 'Switch to Anime'
    }, {
      title: 'List'
    }, {
      title: 'Manga'
    }, {
      title: 'Recent Manga'
    }, {
      title: 'Friends'
    }]
  }]
});

//1st level profile menu
var profileMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'cobaltBlue',
  highlightTextColor: 'white',
  sections: [{
    title: 'Profile',
    items: [{
			title: 'General'
		}, {
      title: 'Anime'
    }, {
      title: 'Manga'
    }]
  }]
});

//Not logged in message
var notLoggedIn = new UI.Card({
	backgroundColor: 'cobaltBlue',
	textColor: 'white',
  body: 'You are not logged in to MAL. Open the settings on your phone to login.'
});

splash.add(splashBackground);
splash.add(splashImage);
splash.add(splashText);

//Aha! The app launch!
splash.show();
init();
setTimeout(function() {
	loadMenu();
}, 1000);

//Load the main menu
function loadMenu() {
	console.log('Loading menu...');
	if (loggedIn === true) {
		notLoggedIn.hide();
		if (mode == 'anime') {
			animeMenu.show();
			mangaMenu.hide();
		} else {
			mangaMenu.show();
			animeMenu.hide();
		}
	} else {
		notLoggedIn.show();
	}
	splash.hide();
}

animeMenu.on('select', function(e) {
	console.log(e.item.title);
	console.log(e.itemIndex);
	if (e.itemIndex === 0) {
		profileMenu.show();
	} else if (e.itemIndex == 1) {
		mode = 'manga';
		loadMenu();
	} else if (e.itemIndex == 2) {
		animeList.show();
	} else if (e.itemIndex == 3) {
		//anime
		openDetailedView('anime', 26243);
	} else if (e.itemIndex == 4) {
		//recent anime
	} else if (e.itemIndex == 5) {
		friendsMenu.show();
	}
});

mangaMenu.on('select', function(e) {
	console.log(e.item.title);
	console.log(e.itemIndex);
	if (e.itemIndex === 0) {
		profileMenu.show();
	} else if (e.itemIndex == 1) {
		mode = 'anime';
		loadMenu();
	} else if (e.itemIndex == 2) {
		mangaList.show();
	} else if (e.itemIndex == 3) {
		//manga
	} else if (e.itemIndex == 4) {
		//recent manga
	} else if (e.itemIndex == 5) {
		friendsMenu.show();
	}
});

profileMenu.on('select', function(e) {
	console.log(e.item.title);
	console.log(e.itemIndex);
	if (e.itemIndex === 0) {
		profileGeneral.show();
		console.log(username);
	} else if (e.itemIndex == 1) {
		profileAnime.show();
	} else if (e.itemIndex == 2) {
		profileManga.show();
	}
});

//Listen for the config page event
Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
	Pebble.openURL('http://floatingcube.web44.net/more/MAL_client/' + configSend);
});

//Listen for the config page closing and save data
Pebble.addEventListener('webviewclosed',
  function(e) {
    var configReply = JSON.parse(decodeURIComponent(e.response));
		if (configReply.username !== undefined) {
			Settings.data('loggedIn', true);
			Settings.data('username', configReply.username);
			Settings.data('password', configReply.password);
			Settings.data('id', configReply.id);
			init();
			loadMenu();
		}
  }
);

//At app ready event (not nessesarily running on watch), and detect platform
Pebble.addEventListener('ready', function() {
    if(Pebble.getActiveWatchInfo) {
      try {
        current_watch = Pebble.getActiveWatchInfo();
      } catch(err) {
        current_watch = {
          platform: "basalt",
        };
      }
    } else {
      current_watch = {
        platform: "aplite",
      };
    }
	console.log('You\'re running the ' + current_watch.platform + ' platform. (basalt = pebble time)');
});