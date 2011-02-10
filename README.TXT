=== Wiredrive Player ===
Contributors: Wiredrive, Drew Baker and Daniel Bondurant
Donate link: http://www.wiredrive.com/rss
Tags: wiredrive, mrss, video, html5
Requires at least: 3.0.0
Tested up to: 3.0.5
Stable tag: 1.0

This plug-in allows you to embed Wiredrive video reels and image galleries into your WordPress-powered website. The plug-in displays media and credits from Wiredrive media RSS (mRSS) links in WordPress webpages and posts.

== Description ==

Wiredrive WordPress Plug-in Features:

* Customizable dimensions
* Displays video or image, title and first credit of each asset
* Show or hide thumbnail tray
* Click through images or play them as a slideshow
* Leverage assets already uploaded to Library
* Download and install in a few clicks
* No web programmer necessary
* Elegantly replaces YouTube, Vimeo and other media hosting sites 

Functionality Specs:

* Displays video, title and first credit of each asset
* The active video's thumbnail will have a black border
* Videos play through Flash in Firefox and Internet Explorer. If Flash isn't installed, the user is prompted to install Chrome or Flash
* In Safari and Chrome the videos will play through an HTML5-skinned player
* In Firefox, IE, Chrome and Safari (including iOS) the feed will play sequentially
* The player controls look the same across all players
* Displays the first item's poster frame
* If the feed does not come from Wiredrive an error is returned
* If the feed is empty an error is returned
* If the feed does not exist an error is returned

Known Issues:

* A one pixel border around the Flash player is hardcoded into the Flash player. Attempts to remove it have been unsuccessful. We are working to fix this issue.
* The poster frame will stretch to fill the player for browsers that use Flash if the file's aspect ratio differs from the dimensions you've set for the player. This is an issue with the Flash player. We are working to fix this issue.
* Safari uses the HTML5 player built on WebKit, and fullscreen is currently only partially implemented. Fullscreen is possible, but the video improperly scales if the player is set to a different aspect ration than the video file.

Untested:

* Video playback on Android. Android currently plays .mp4 and H.264 files. No plans to play .mov files have been announced.
* Playback for formats that Safari and Chrome do not natively support (e.g., .avi or .divx).

== Installation ==

1.	Log into your WordPress administration page and select Add New from the Plugins menu
1.	Select Author from the search drop-down menu, enter Wiredrive, click Search Plugins
1.	Click Install Now under the plug-in
1.	Click on Plugins from the Plugin menu and make sure that the plug-in is activated

**See Also:** ["Installing Plugins" article on the WP Codex](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins)

== Frequently Asked Questions ==

[Please see "Wiredrive Media RSS FAQ" on Wiredrive.com](http://www.wiredrive.com/archives/4853/)

== Changelog ==

= 1.1 =
* Fixed issues when showing multiple slideshows on the one page.
* Fixed issue where Flash player would set all the stages to have a transparent background.
* Cleaned up code.
* Updated readme.txt and embed dialog box. 

= 1.0 =
* First stable release.

== Upgrade Notice ==

= 1.1 =
* This version fixes issues with using multiple players on a single page.

= No upgrades are currently available. =