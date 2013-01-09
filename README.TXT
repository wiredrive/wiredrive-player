=== Wiredrive Player ===
Contributors: Wiredrive
Donate link: http://www.wiredrive.com/rss
Tags: wiredrive, mrss, video, html5
Requires at least: 3.0.0
Tested up to: 3.5
Stable tag: 2.2.0

This plug-in allows you to embed Wiredrive video reels and image galleries into your WordPress-powered website.

== Description ==

Wiredrive WordPress Plug-in Features:
* Customizable dimensions
* Displays video or image, title and first credit of each asset
* Multiple layout options
* Show or hide thumbnail tray
* Customizable color options
* Works with AirPlay
* Click through images or play them as a slideshow
* Leverage assets already uploaded to Library
* Download and install in a few clicks
* No web programmer necessary
* Elegantly replaces YouTube, Vimeo and other media hosting sites 

Functionality Specs:
* Displays video, title and first credit of each asset
* The active video's thumbnail will have a border
* Videos play through Flash in Firefox, Internet Explorer and Chrome. If Flash isn't installed, the user is prompted to install Safari or Flash
* In Safari, videos play natively using the HTML5 player 
* In Firefox, IE, Chrome and Safari (including iOS) the feed will play sequentially
* Displays the first item's poster frame
* If the feed does not come from Wiredrive an error is returned
* If the feed is empty an error is returned
* If the feed does not exist an error is returned
* Works with MRSS feeds, short links and presentation URLs.

== Installation ==

1.	Log into your WordPress administration page and select Add New from the Plugins menu
1.	Select Author from the search drop-down menu, enter Wiredrive, click Search Plugins
1.	Click Install Now under the plug-in
1.	Click on Plugins from the Plugin menu and make sure that the plug-in is activated

**See Also:** ["Installing Plugins" article on the WP Codex](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins)

== Frequently Asked Questions ==

[Please see "Wiredrive extensions for WordPress" on Wiredrive.com](http://www.wiredrive.com/support/getting-started/wiredrive-extensions-for-wordpress/)

== Changelog ==

= 2.2.0 =
* fixed bug where & characters in asset URLs were not being passed to flash correctly.
* fixed a bug when hidethumbs was enabled. tag wasn't closed properly.
* fix for html entities being displayed instead of applicable characters.
* removing poster element which caused a thumbnail bug when a video was played.
* fix for html entities being displayed instead of applicable characters.
* height/width resize fix. courtesy Visual23 - Robb Bennett (rbennett@visual23.com)
* removing poster element which caused a thumbnail bug when a video was played
* renamed files so they will work better with other plugins.  settings.php was conflicting with other plugins settings files in php5.2

= 2.1.2 =
* Fixed width/height bug.  Fixed credit list bug

= 2.1.1 =
* Bug fix.

= 2.1 =
* Added play button on HTML5 video.
* Added play.wdp and ended.wdp events to player.

= 2.0.3 =
* Updated readme.txt file.

= 2.0.2 =
* Fixed a bug which caused all "Settings" links on the Plugins page to link to players settings page.

= 2.0.1 =
* Fixed a bug where entering an RSS that started with 'feed://' gave an error.
* Fixed a bug where thumbnails in a grid layout didn't stack correctly.

= 2.0 =
* Added AirPlay compatibility
* New settings page that allows customization of the player
* New letter- or pillar- box grid layout

= 1.1 =
* Fixed issues when showing multiple slideshows on the one page.
* Fixed issue where Flash player would set all the stages to have a transparent background.
* Cleaned up code.
* Updated readme.txt and embed dialog box. 

= 1.0 =
* First stable release.

== Upgrade Notice ==

= 2.2.0 =
* Fixed issue with & in asset URLs.  Fixed HTML encoding and layout issues.

= 2.1.2 =
* Fixed width/height bug.  Fixed credit list bug

= 2.1.1 =
Bug fix.
