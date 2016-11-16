=== Wiredrive Player ===
Contributors: Wiredrive
Donate link: http://www.wiredrive.com/mrss
Tags: wiredrive, mrss, video, html5, jsonp
Requires at least: 3.4.0
Tested up to: 4.6
Stable tag: 3.1.0
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

* Theme changes: As of version 3.0, Grid and Grid-box themes have been merged into one theme called the Gallery theme. When the player detects a post with shortcode from an older version of the player that used either grid or grid-box themes, it will translate them as best it can into a Gallery theme equivalent, hopefully meaning you won't need to regenerate the shortcode for your post. The theme translation strategy is as follows:
  * "grid" theme becomes "gallery-player" with thumbnail strategy set to "scale" and the thumbnail dimensions set to 180x180
  * "grid-box" theme becomes "gallery-player" with the thumbnail strategy set to "scale", the thumbnail dimensions set to 180x180, and center-align thumbnails (letterboxing) turned on
* The structure of the markup has drastically changed. If you have custom stylesheets defined to override the default styles of the player (styles that are _not_ covered by the Player's admin color preferences), they will need to be updated to reflect the new markup.

Known issues:

* iPad: Autoplay videos is not supported on the ipad. This is a limitation set by Apple with no workarounds. Because of this limitation, autoplay will only perform a function on iOS if the entire presentation consists of images and slideshow is enabled. If there is a video at any position in the presentation, it can not be guaranteed that the video will start playing when slideshow'ed into due to the additional limitation of only being able to programmatically play html5 video on iOS if the play command is in an execution stack that originates with a user interaction event (click, touch, etc) (Slideshows change the asset through a timeout, which is not a user interaction event)
* iPad: No flick/swipe gesture support for the carousel. We'd like to keep the dependencies of this plugin as small as possible (jQuery and jQuery UI being the only dependencies) and support for this is not built into jQuery. We felt this feature alone wasn't worth adding an additional dependency or the increased size of the player script by 33%.
* iPad: Pagination arrows will not appear in the inline player on mobile devices due to an iPad bug that does not allow processing of events on elements that are positioned over a video element with native controls
* IE8 does not support the Crop thumbnail strategy for galleries (although strangely enough, it works in IE8 emulation mode inside of IE9...). The crop strategy renders the thumbnail bounding box according to its specified dimensions and then sets the thumbnail of the asset as the background image of the bounding box (centered vertically and horizontally), making the bounding box act as a cropping mask for the thumbnail. IE8 does not handle background image scaling/positioning well, and the pillarbox/letterbox opacity -ms-filter directive conflicts with the background image. Because of this, IE8 will render all gallery thumbnails using the Scale strategy. All other supported browsers will respect the Crop strategy.
* IE8: Shortcode will always be inserted at the beginning of the text editor, regardless of where the text cursor is. This is a bug inside TinyMCE.
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
= 3.1.0 =
* Switched to HTML5 video player by default

= 3.0.3 =
* Fixed bug in IE11 that prevented some videos in the gallery modal from scaling correctly, causing the video player to scale to 0x0.

= 3.0.2 =
* Bugfix: Updated to fix admin style issues with WordPress 6
* Bugfix: If Flash fails to load a video, it no longer prevents you from loading another video

= 3.0.1 =
* Bugfix: Moved player strategy logic to JavaScript from PHP to address to prevent caching layers from caching the strategy of the first browser to cause a cache miss.

= 3.0 =
* Video poster images now use the largest thumbnail
* Overlay pagination arrows should no longer be visible on iPad 1
* Bugfix: If a presentation contains both images and videos, set to slideshow, no autoplay, and the first asset is a video, the slideshow button no longer conflicts with the play button.
* Bugfix: HTML5 - Image viewer no longer visible at init if first asset is video (regression: lead to rendering errors)
* Bugfix: HTML5 Gallery thumbnails now play the correct video.
* Bugfix: Setting the credit count to 0 now behaves correctly

= 3.0b2 =
* proxy calls to retrieve a presentation url can now only be made by authenticated WordPress admins
* Removed all PHP short tags
* Fixed video poster image justification
* Pagination arrows now only appear if there is more than one asset in the presentation
* A presentation with no viewable assets now renders out an error message in place of the player. It no longer generat
es JavaScript errors.
* Added loading indicator to post Dialog window on submit.

= 3.0b1 =
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

= 2.2.6 =
* Bugfix: Making HTML5 video instances not resize after switching to the next video

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

== Upgrade Notice ==

= 3.0.1 =
* Bugfix: Moved player strategy logic to JavaScript from PHP to prevent caching layers to cache the strategy of the first browser to cause a cache miss

= 3.0 =
* Addressed all outstanding bugs and added additional features.
* See the 3.0, 3.0b1, and 3.0b2 changelog above for a complete list of changes.
* See Backwards Compatability section above before upgrading.

= 2.2.6 =
* Bugfix: Making HTML5 video instances not resize after switching to the next video

= 2.2.5 =
* Bugfix: Preventing slideshow instances from disappearing/reappearing and affecting other player instances in the same document
