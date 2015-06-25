//Libraries
var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');

//Menus
var animeList;
var mangaList;
var profileGeneral;
var profileAnime;
var profileManga;
var friends;

//Art Window
var art;
var artLoadingText;
var artPage;

//Variables
var current_watch;
var gender = 'Unknown';
var birthday = 'January 1, 1900';
var location = 'City, Country';
var joinDate = 'January 1, 1900';
var accessRank = 'Member';
var animeListViews = '0';
var mangaListViews = '0';
var comments = '0';
var numFriends = '0';
var animeDays = '0.0';
var animeWatching = '0';
var animeCompleted = '0';
var animeOnHold = '0';
var animeDropped = '0';
var animePlanToWatch = '0';
var animeTotalEntries = '0';
var mangaDays = '0.0';
var mangaReading = '0';
var mangaCompleted = '0';
var mangaOnHold = '0';
var mangaDropped = '0';
var mangaPlanToRead = '0';
var mangaTotalEntries = '0';
var mode = 'anime';
var username = 'Default';
var id = '1';
var password = 'default';
var configSend = '';
var loggedIn = false;

//Temporary Login
Settings.data('loggedIn', true);

//Initialize settings and stuff
function init() {
	console.log('Initializing...');
	if (Settings.data('loggedIn') === true) {
		loggedIn = true;
		username = Settings.data('username');
		id = Settings.data('id');
		password = Settings.data('password');
		configSend = '?username=' + username + '&password=' + password + '&id=' + id;
		initMenus();
	} else {
		loggedIn = false;
		Settings.data('loggedIn', false);
		console.log('Eek! You\'re not logged in! You should probably login using the config window.');
	}
}

//Initialize those dynamic menus. To be called after online request.
function initMenus() {
	console.log('Initializing those dynamic menus');
	animeList = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'List',
			items: [{
				title: '(' + animeWatching + ') Watching'
			}, {
				title: '(' + animeCompleted + ') Completed'
			}, {
				title: '(' + animeOnHold + ') On Hold'
			}, {
				title: '(' + animeDropped + ') Dropped'
			}, {
				title: '(' + animePlanToWatch + ') Plan to Watch'
			}]
		}]
	});
	mangaList = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'List',
			items: [{
				title: '(' + mangaReading + ') Reading'
			}, {
				title: '(' + mangaCompleted + ') Completed'
			}, {
				title: '(' + mangaOnHold + ') On Hold'
			}, {
				title: '(' + mangaDropped + ') Dropped'
			}, {
				title: '(' + mangaPlanToRead + ') Plan to Read'
			}]
		}]
	});
	profileGeneral = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'General',
			items: [{
				title: 'Username',
				subtitle: username
			}, {
				title: 'Gender',
				subtitle: gender
			}, {
				title: 'Birthday',
				subtitle: birthday
			}, {
				title: 'Location',
				subtitle: location
			}, {
				title: 'Join Date',
				subtitle: joinDate
			}, {
				title: 'Access Rank',
				subtitle: accessRank
			}, {
				title: 'Anime List Views',
				subtitle: animeListViews
			}, {
				title: 'Manga List Views',
				subtitle: mangaListViews
			}, {
				title: 'Comments',
				subtitle: comments
			}]
		}]
	});
	profileAnime = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'Anime',
			items: [{
				title: 'Time (days)',
				subtitle: animeDays
			}, {
				title: 'Watching',
				subtitle: animeWatching
			}, {
				title: 'Completed',
				subtitle: animeCompleted
			}, {
				title: 'On Hold',
				subtitle: animeOnHold
			}, {
				title: 'Dropped',
				subtitle: animeDropped
			}, {
				title: 'Plan to Watch',
				subtitle: animePlanToWatch
			}, {
				title: 'Total Entries',
				subtitle: animeTotalEntries
			}]
		}]
	});
	profileManga = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'Manga',
			items: [{
				title: 'Time (days)',
				subtitle: mangaDays
			}, {
				title: 'Reading',
				subtitle: mangaReading
			}, {
				title: 'Completed',
				subtitle: mangaCompleted
			}, {
				title: 'On Hold',
				subtitle: mangaOnHold
			}, {
				title: 'Dropped',
				subtitle: mangaDropped
			}, {
				title: 'Plan to Read',
				subtitle: mangaPlanToRead
			}, {
				title: 'Total Entries',
				subtitle: mangaTotalEntries
			}]
		}]
	});
	friends = new UI.Menu({
		backgroundColor: 'white',
		textColor: 'black',
		highlightBackgroundColor: 'blue',
		highlightTextColor: 'black',
		sections: [{
			title: 'Friends (' + numFriends + ')',
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

//Make that splash window!
var splash = new UI.Window();

var splashImage = new UI.Image({
  position: new Vector2(0, 15),
  size: new Vector2(144, 100),
  image:'images/logo~color.png'
});

var splashText = new UI.Text({
  position: new Vector2(0, 110),
  size: new Vector2(144, 168),
  text:'CLIENT',
  font:'GOTHIC_28',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center'
});

var splashBackground = new UI.Rect({
	position: new Vector2(0, 0),
	size: new Vector2(144, 168),
	backgroundColor: 'white'
});

//Default menu in anime mode
var animeMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'black',
  sections: [{
    title: 'Anime',
    items: [{
      title: 'My Profile',
			subtitle: 'Spent days: ' + animeDays
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
var mangaMenu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'black',
  sections: [{
    title: 'Manga',
    items: [{
      title: 'My Profile',
			subtitle: 'Spent days: ' + mangaDays
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
var profile = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'black',
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
		profile.show();
	} else if (e.itemIndex == 1) {
		mode = 'manga';
		loadMenu();
	} else if (e.itemIndex == 2) {
		animeList.show();
	} else if (e.itemIndex == 3) {
		//anime
		setArtwork('http://cdn.myanimelist.net/images/anime/13/17405.jpg');
		artPage.show();
	} else if (e.itemIndex == 4) {
		//recent anime
	} else if (e.itemIndex == 5) {
		friends.show();
	}
});

mangaMenu.on('select', function(e) {
	console.log(e.item.title);
	console.log(e.itemIndex);
	if (e.itemIndex === 0) {
		profile.show();
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
		friends.show();
	}
});

profile.on('select', function(e) {
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
			//loggedIn = true;
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