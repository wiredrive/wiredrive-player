Wiredrive Player (Wordpress Plugin)
====
* Requires at least: Wordpress 3.4.0
* Contributors: Wiredrive
* Stable tag: 3.1.0
* License: GPLv2 or later
* Dependencies: jQuery 1.7.2 or higher, jQuery UI 1.8.20 or higher

### Description

A plugin that allows you to easily embed videos and images from Wiredrive presentations into your Wordpress-powered website:

* Embed mixed media presentations (video and images)
* Point-and-click installation
* Elegantly replaces YouTube, Vimeo, and other media hosting sites
* Customize the appearance of your player
* Two different layout options (an inline video/image slideshow or a gallery of thumbnails)
* Optional expandable thumbnail tray
* Click through assets or play them as a slideshow (with a configurable timeout setting)
* Multiple players on a single page
* Show a configurable number of credits (with or without the credit label)
* Loop

Once the plugin is installed, simply create or edit a post and click on the Wiredrive Player button in the Kitchen Sink menu to create a Wiredrive Player instance. Enter the url to the Wiredrive presentation you wish to display, customize it, and click "Okay". Shortcode will be inserted into the visual editor at the location of your cursor (except for IE8: see Known Issues below). Save and view the post and you'll see your media from the Wiredrive presentation embedded right in your post!

Supported Platforms
----
The Wiredrive Player is written with the following environments in mind: Internet Explorer 8 and 9, the lastest versions of Firefox, Chrome, Safari, and Safari on the iPad.

Depending on the environment, the player will load one of two video players (if the presentation contains videos): The native HTML5 player will be used on Safari and iPad, all other browsers will use Adobe Strobe (Flash).

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
* IE8 does not support the Crop thumbnail strategy for galleries (although strangely enough, it works in IE8 emulation mode inside of IE9...). The crop strategy renders the thumbnail bounding box according to its specified dimensions and then sets the thumbnail of the asset as the background image of the bounding box (centered vertically and horizontally), making the bounding box act as a cropping mask for the thumbnail. IE8 does not handle background image scaling/positioning well, and the pillarbox/letterbox opacity -ms-filter directive conflicts with the background image. Because of this, IE8 will render all gallery thumbnails using the Scale strategy. All other supported browsers will respect the Crop strategy.
* IE8: Shortcode will always be inserted at the beginning of the text editor, regardless of where the text cursor is. This is a bug inside TinyMCE.
* Firefox: When the gallery modal player is opened, the main page behind the skrim may jump to the top of the page while the skrim is open and then when the skrim is closed jump back to the scroll position the page was in before the skrim opened. This is probably because there is a rule in the wordpress theme stylesheet (or perhaps another plugin) that defines an important margin-top css rule on the html element. Firefox automatically scrolls to the top of the page when overflow: hidden is applied to the html element. To counter this, the page is programmatically shifted to the correct position via an inline margin-top rule applied to the html element. An important rule will supersede this countermeasure, causing the bug to reappear.
* A flash of miscaled, misaligned stale images may appear while transitioning between two images. This is probably because the user has local caching disabled. Image transitions happen by opacity fading between two absolutely positioned image elements (the current image and the next image). The player preloads all presentation images in memory to avoid this flickering, but if local caching is disabled, it will have to fetch the next image every time causing a delay in the correct image appearing that the fader cannot anticipate.

Backwards Compatibility Notes
----
### Merging of Grid and Grid-box themes
As of version 3.0, Grid and Grid-box themes have been merged into one theme called the Gallery theme. When the player detects a post with shortcode (the `[wiredrive ...][/wiredrive]` text that gets inserted into your post) from an older version of the player that used grid or grid-box themes, it will automatically translate them as best it can into a Gallery theme with equivalent settings. Hopefully this means that you will not need to regenerate the player shortcode for players that now contain deprecated themes/settings

The translation strategy is as follows:

* "grid" theme becomes "gallery-player", the thumbnail strategy (`thumbfit`) is set to "scale", and the thumbnail dimensions are set to 180x180
* "grid-box" is the same as "grid" translation, but with Center-align Thumbnail (`letterbox`) turned on: "grid-box" becomes "gallery-player", thumbfit is set to "scale", letterbox is turned "on", and the thumbnail dimensions are set to 180x180

### Markup structure change
As of version 3.0, the structure of the HTML markup of the player has changed significantly (new structure, new class names, etc). If you have custom stylesheets defined to override/enhance the default styles of the player (styles that are *not* covered by the Player's admin color preferences), they will need to be updated to reflect the new markup structure.

FAQ
----

### What happened to the Grid and Grid-box display options?
In version 3.0, we decided to combine the grid and grid-box options into a single theme called the Gallery Theme. Any players that were created as grid or grid-box displays will automatically convert themselves to the proper Gallery player at render time. See the "Backwards Compatibility Notes" section above for more info

### What is the difference between the "Scale" and "Crop" thumbnail strategies for the Gallery player?
When using the Gallery theme, each asset thumbnail is rendered to the DOM as follows: A thumbnail container element is drawn with the dimensions specified in the "Thumbnail dimensions" section of the Gallery theme options. The thumbnail strategy defines the rest:

* When in scale mode, an image element whose source is the asset's thumbnail is drawn inside the bounding box. The image is scaled to fit within side the bounding box while preserving the original image's aspect ratio. Once the image is scaled to fit within the specified bounding box, the bounding box will collapse around the scaled image (unless the "Center-align thumbnail (letterbox)" option is checked, in which case, the bounding box will remain its specified size and the areas of the bounding box that do not overlap the scaled image will be shaded in with a dark gray color set to the opacity specified by the "Pillarbox and letterbox opacity" setting in the Wiredrive Player Settings admin page)
* When in crop mode, the thumbnail image is used as the horizontally-and-vertically-centered background image of the thumbnail bounding box. This means that the dimensions you specify for the thumbnails now act as the dimensions for a horizontally and vertically centered cropping mask over the original thumbnail.

### Why aren't there any animations in Internet Explorer?
The new player was built with evolving and current web standards in mind. The animations no longer rely on jQuery's animation layer and instead use a pure CSS3 solution. This unfortunately means that browsers that lag behind this curve will not have some of the nice polish like thumbnail carousel animations and fading transitions.

Recent Changelog
----
### 3.1.0
* Switched to HTML5 video player by default

### 3.0.3
* Fixed bug in IE11 that prevented some videos in the gallery modal from scaling correctly, causing the video player to scale to 0x0.

### 3.0.2
* Bugfix: Updated to fix admin style issues with WordPress 6
* Bugfix: If Flash fails to load a video, it no longer prevents you from loading another video

### 3.0.1
* Bugfix: Moved player strategy logic to JavaScript from PHP to address (issue 34)[https://github.com/wiredrive/wiredrive-player/issues/34]

## 3.0
* Video poster images now use the largest thumbnail
* Overlay pagination arrows should no longer be visible on iPad 1
* Bugfix: If a presentation contains both images and videos, set to slideshow, no autoplay, and the first asset is a video, the slideshow button no longer conflicts with the play button.
* Bugfix: HTML5 - Image viewer no longer visible at init if first asset is video (regression: lead to rendering errors)
* Bugfix: HTML5 Gallery thumbnails now play the correct video.
* Bugfix: Setting the credit count to 0 now behaves correctly

### 3.0b2
* proxy calls to retrieve a presentation url can now only be made by authenticated WordPress admins
* Removed all PHP short tags
* Fixed video poster image justification
* Pagination arrows now only appear if there is more than one asset in the presentation
* A presentation with no viewable assets now renders out an error message in place of the player. It no longer generat
es JavaScript errors.
* Added loading indicator to post Dialog window on submit.

### 3.0b1
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
