=== Wiredrive Player ===
Contributors: Wiredrive, Drew Baker and Daniel Bondurant
Donate link: http://www.wiredrive.com/rss
Tags: wiredrive, mrss, video, html5
Requires at least: 3.0.0
Tested up to: 3.0.4
Stable tag: trunk

Displays a Wiredrive mRSS feed as a HTML5 or Flash powered video player.

== Description ==

This plug-in displays videos and credits from Wiredrive media RSS links in WordPress pages and posts.

Feature List:

*   Displays Wiredrive mRSS feeds in an embedded player on a WordPress-powered site.
*   If the mRSS feed contains more than one item, the player displays a thumbnail tray that scrolls left and right. The tray stops on the last item.*
*   Displays video, title and first credit of each asset.
*   The active video's thumbnail will have a black border.
*   Videos play through Flash in Firefox and Internet Explorer. If Flash isn't installed, the user is prompted to install Chrome or Flash. 
*   In Safari and Chrome the videos will play through an HTML5-skinned player.
*   In Firefox, IE, Chrome and Safari (including iOS) the feed will play sequentially. 
*   The player controls look the same across all players.*
*   Displays the first item's poster frame.*
*   If the feed does not come from Wiredrive an error is returned.
*   If the feed is empty an error is returned.
*   If the feed does not exist an error is returned.
*   Easy to customize to your theme using CSS and jQuery.

Known Issues:

*   A one pixel border around the Flash player is hardcoded into the Flash Player. Attempts to remove it have been unsuccessful. We are working to fix this issue.
*   The poster frame will stretch rather than box resize in Flash. This is an issue with the Flash Player and we are working to fix this issue.
*   The volume controls operation differs slightly in Flash from the HTML5 controls. Click to change in Flash, as opposed to the more user-friendly click and drag in HTML5.
*   Safari uses the HTML5 player built on WebKit, and fullscreen is currently only partially implemented. Fullscreen is possible, but the video improperly scales if the player is set to a different aspect ration than the video file.

Untested:

*   Video playback on Android. Android only plays .mp4 and H.264 and has not announced plans to play .mov files.
*   Playback for formats that Safari and Chrome do not natively support (e.g., .avi or .divx).

== Installation ==

1. Download the plugin.
1. Log into WordPress and select 'Add New' from the 'Plugins' menu.
1. Select 'Upload' from the top menu.
1. Upload `wiredrive-wordpress-video-player.zip`.
1. Once the plug-in is uploaded, you will be prompted to activate it.
1. The Wiredrive icon appears on the second level of the visual editor when writing a new post or page.

**See Also:** ["Installing Plugins" article on the WP Codex](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins)

== Frequently Asked Questions ==

[Please see the "Wiredrive Media FAQ" article on Wiredire.com](http://www.wiredrive.com/customercare/archives/4853/)

== Changelog ==

= 1.0 =
* First stable release.


== Upgrade Notice ==

= No upgrades are currently available. =