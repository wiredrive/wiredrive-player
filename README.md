Wiredrive Player (Wordpress Plugin)
====
* Requires at least: Wordpress 3.4.0
* Contributors: Wiredrive
* Stable tag: 2.3
* License: GPLv2 or later
* Dependencies: jQuery 1.7.2 or higher, jQuery UI 1.8.20 or higher

### Description

A plugin that allows you to easily embed videos and images from Wiredrive presentations into your Wordpress-powered website.

Installation
----

### Installation through Wordpress
1. Log into your Wordpress administration page and select "Add New" from the "Plugins" menu
2. Select "Author" from the search drop-down menu and enter "Wiredrive". Click "Search Plugins"
3. Click "Install" under the Wiredrive Player plugin
4. Click on `Plugins` from the Plugin menu and make sure that the plugin is activated

### Installation through Source Code checkout
1. Clone the repository into either the `wp-content/plugins/` directory of your Wordpress install, or clone it to a place of your choice and add a symlink inside the `wp-content/plugins/` directory named `wiredrive-player` that points to your checkout of this repo.
2. Make sure that the plugin is activated in the "Plugins" list

Known Issues
----
* iPad: Autoplay videos is not supported on the ipad. This is a limitation set by Apple with no workarounds. Because of this limitation, autoplay will only perform a function on iOS if the entire presentation consists of images and slideshow is enabled. If there is a video at any position in the presentation, it can not be guaranteed that the video will start playing when slideshow'ed into due to the additional limitation of only being able to programmatically play html5 video on iOS if the play command is in an execution stack that originates with a user interaction event (click, touch, etc) (Slideshows change the asset through a timeout, which is not a user interaction event)
* iPad: No flick/swipe gesture support for the carousel. We'd like to keep the dependencies of this plugin as small as possible (jQuery and jQuery UI being the only dependencies) and support for this is not built into jQuery. We felt this feature alone wasn't worth adding an additional dependency or the increased size of the player script by 33%.
* iPad: Pagination arrows will not appear in the inline player on mobile devices due to an iPad bug that does not allow processing of events on elements that are positioned over a video element with native controls
* IE8: Shortcode will always be inserted at the beginning of the text editor, regardless of where the text cursor is. This is a bug inside TinyMCE.
* Firefox: When the gallery modal player is opened, the main page behind the skrim may jump to the top of the page while the skrim is open and then when the skrim is closed jump back to the scroll position the page was in before the skrim opened. This is probably because there is a rule in the wordpress theme stylesheet (or perhaps another plugin) that defines an important margin-top css rule on the html element. Firefox automatically scrolls to the top of the page when overflow: hidden is applied to the html element. To counter this, the page is programmatically shifted to the correct position via an inline margin-top rule applied to the html element. An important rule will supersede this countermeasure, causing the bug to reappear.
* A flash of miscaled, misaligned stale images may appear while transitioning between two images. This is probably because the user has local caching disabled. Image transitions happen by opacity fading between two absolutely positioned image elements (the current image and the next image). The player preloads all presentation images in memory to avoid this flickering, but if local caching is disabled, it will have to fetch the next image every time causing a delay in the correct image appearing that the fader cannot anticipate.

Backwards Compatibility Notes
----
### Merging of Grid and Grid-box themes
As of version 2.3, Grid and Grid-box themes have been merged into one theme called the Gallery theme. When the player detects a post with shortcode (the `[wiredrive ...][/wiredrive]` text that gets inserted into your post) from an older version of the player that used grid or grid-box themes, it will automatically translate them as best it can into a Gallery theme with equivalent settings. Hopefully this means that you will not need to regenerate the player shortcode for players that now contain deprecated themes/settings

The translation strategy is as follows:

* "grid" theme becomes "gallery-player", the thumbnail strategy (`thumbfit`) is set to "scale", and the thumbnail dimensions are set to 180x180
* "grid-box" is the same as "grid" translation, but with Center-align Thumbnail (`letterbox`) turned on: "grid-box" becomes "gallery-player", thumbfit is set to "scale", letterbox is turned "on", and the thumbnail dimensions are set to 180x180

### Markup structure change
As of version 2.3, the structure of the HTML markup of the player has changed significantly (new structure, new class names, etc). If you have custom stylesheets defined to override/enhance the default styles of the player (styles that are *not* covered by the Player's admin color preferences), they will need to be updated to reflect the new markup structure.

FAQ
----
[Please see "Wiredrive extensions for Wordpress" on Wiredrive.com](http://www.wiredrive.com/support/getting-started/wiredrive-extensions-for-wordpress/)

Recent Changelog
----

### 2.3
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

For a complete list of changes, see the CHANGELOG.md file
