=== Wiredrive Player ===
Contributors: Wiredrive
Donate link: http://www.wiredrive.com/mrss
Tags: wiredrive, mrss, video, html5, jsonp
Requires at least: 3.4.0
Tested up to: 3.5
Stable tag: 2.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plug-in allows you to embed Wiredrive video reels and image galleries into your WordPress-powered website.

== Description ==

Wiredrive WordPress Plug-in Features:

* Customizable dimensions
* Displays videos and/or images, title and a configurable number of credits of each asset
* Multiple layout options
* Show or hide thumbnail tray
* Customizable color options
* Works with AirPlay
* Click through assets or play them as a slideshow
* Leverage assets already uploaded Projects or Library
* Download and install in a few clicks
* Elegantly replaces YouTube, Vimeo and other media hosting sites

Functionality Specs:

* Displays asset, title and first credit of each asset
* The active asset's thumbnail will have a border
* Videos play through Flash in Firefox, Internet Explorer and Chrome. If Flash isn't installed, the user is prompted to install Safari or Flash
* In Safari/iOS, videos play natively using the HTML5 player 
* Assets will play sequentially
* Displays the first asset's poster frame if it's a video (unless autoplay is enabled and supported)
* Works with all valid Wiredrive presentation URLs (short link, mRSS, email, etc.)
* If the feed does not come from Wiredrive an error is returned
* If the feed is empty an error is returned
* If the feed does not exist an error is returned

Backwards Compatability Notes:

* Theme changes: As of version 2.3, Grid and Grid-box themes have been merged into one theme called the Gallery theme. When the player detects a post with shortcode from an older version of the player that used either grid or grid-box themes, it will translate them as best it can into a Gallery theme equivalent, hopefully meaning you won't need to regenerate the shortcode for your post. The theme translation strategy is as follows:
  * "grid" theme becomes "gallery-player" with thumbnail strategy set to "scale" and the thumbnail dimensions set to 180x180
  * "grid-box" theme becomes "gallery-player" with the thumbnail strategy set to "scale", the thumbnail dimensions set to 180x180, and center-align thumbnails (letterboxing) turned on
* The structure of the markup has drastically changed. If you have custom stylesheets defined to override the default styles of the player (styles that are _not_ covered by the Player's admin color preferences), they will need to be updated to reflect the new markup.

Known issues:

* iPad: Autoplay is not supported on iPad. This is a limitation set by Apple. Because of this limitation, autoplay will only perform a function on iOS if the entire presentation consists of images and slideshow is enabled. If there is a video at any position in the presentation, it can not be guaranteed that the video will start playing when slideshow'ed into due to the additional limitation of only being able to programmatically play html5 video on ISO if the play command is in an execution stack that originates with a user interaction event (click, touch, etc)
* iPad: The pagination arrows overlayed over the currently playing asset will not be visible on mobile devices. This is due to an iPad bug that does not allow processing of events on elements that are positioned over a video element with native controls.
* Internet Explorer 8: The shortcode for the wiredrive player will always be inserted at the beginning of the post regardless of where the cursor is. This is a bug in TinyMCE. If you are using IE8, you will need to manually cut/paste the generated shortcode for the wiredrive player into place in your post.
* Firefox: When the gallery modal player is opened, the main page behind the skrim may jump to the top of the page while the skrim is open and then when the skrim is closed jump back to the scroll position the page was in before the skrim opened. This is probably because there is a rule in the wordpress theme stylesheet (or perhaps another plugin) that defines an important margin-top css rule on the html element. Firefox automatically scrolls to the top of the page when overflow: hidden is applied to the html element. To counter this, the page is programmatically shifted to the correct position via an inline margin-top rule applied to the html element. An important rule will supersede this countermeasure, causing the bug to reappear.
* A flash of miscaled, misaligned stale images may appear while transitioning between two images. This is probably because the user has local caching disabled. Image transitions happen by opacity fading between two absolutely positioned image elements (the current image and the next image). The player preloads all presentation images in memory to avoid this flickering, but if local caching is disabled, it will have to fetch the next image every time causing a delay in the correct image appearing that the fader cannot anticipate. 

== Installation ==

1.	Log into your WordPress administration page and select Add New from the Plugins menu
1.	Select Author from the search drop-down menu, enter Wiredrive, click Search Plugins
1.	Click Install Now under the plug-in
1.	Click on Plugins from the Plugin menu and make sure that the plug-in is activated

**See Also:** ["Installing Plugins" article on the WP Codex](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins)

== Frequently Asked Questions ==

[Please see "Wiredrive extensions for WordPress" on Wiredrive.com](http://www.wiredrive.com/support/getting-started/wiredrive-extensions-for-wordpress/)

== Changelog ==

= 2.3 =
* Player now properly supports multiple instances on a single page
* Presentation data is now recieved as JSONP
* Player can now display both images and videos as part of the same presentation
* Now accepts any valid (non password protected) Wiredrive presentation url (short link, mRSS, email, etc.)
* Grid and Grid-Box themes have been replaced by the Gallery theme
* Player can now loop entire presentations
* Slideshow functionality can now be controlled via on hover play/pause buttons
* Duration between slideshows is now customizable
* Number of credits being displayed is now customizable
* Added option to choose whether or not the credit label is displayed with each credit
* Gallery thumbnails can now be either constrained to fit within the thumbnail bounding box (Scale) or the bounding box can be used as a cropping mask for the thumbnail (Crop)
* Gallery players can now specify a linebreak, that is how many thumbnails will be rendered before the next thumbnail is forced to the line below
* Bugfix: Flash volume slider now works (Open Video Player has been replaced with Adobe Strobe)

= 2.2.5 =
* Bugfix: Preventing slideshow instances from disappearing/reappearing and affecting other player instances in the same document

= 2.2.4 =
* Added poster image to html5 template

= 2.2.3 =
* Bumping version to make wordpress.org behave

= 2.2.2 =
* renamed README.txt to readme.txt for issue with wordpress.org
* Added GPLv2 license

= 2.2.1 =
* Fixed README layout issue with wordpress.org

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
