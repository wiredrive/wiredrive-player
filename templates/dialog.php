<?php
    $height = $this->get('height');
    $width = $this->get('width');
    $duration = $this->get('duration');
?>
<div class="hidden">
    <div id="wd-dialog">
        <div class="wd-dialog-content">
            <div id="wd-dialog-message">
                <p>Enter the address of the Wiredrive presentation or Wiredrive mRSS feed you'd like to display. Presentations can contain any combination of video and image files (JPG, GIF or PNG). Any files that are not recognized as video or image will be ignored.
                <p><strong>Examples:</strong></p>
                <p class="wd-examples">
                    <code>https://iowa.wiredrive.com/present-reel/token/fa7b8e8e8624199b8c0fd311f9e37c29</code>
                    <code>http://www.wdcdn.net/rss/presentation/library/client/iowa/id/fa7b8e8e8624199b8c0fd311f9e37c29</code>
                    <code>http://wdrv.it/10C73Oy</code>
                </p>
                <p><input type="text" id="wd-url" /></p>
            </div>

            <div class="wd-player-options">
                <strong>Player options</strong>
                <ul>
                    <li>
                        <span class="wd-label">Theme:</span>
                        <span class="wd-value">
                            <select name="theme" id="wd-theme">
                                <option value="inline-player">Reel/Slideshow</option>
                                <option value="gallery-player">Gallery</option>
                            </select>
                        </span>
                    </li>
                    <li>
                        <span class="wd-label">
                            <input id="wd-loop" name="loop" type="checkbox" /> <label for="wd-loop">Loop</label>
                        </span>
                    </li>
                    <li>
                        <span class="wd-label">
                            <input id="wd-slideshow" name="autoslideshow" type="checkbox" />
                            <label for="wd-slideshow">Slideshow images every</label>
                            <input id="wd-duration" name="duration" type="text" value="<?php echo $duration; ?>" disabled /> seconds
                        </span>
                    </li>
                </ul>
            </div>

            <div id="wd-reel-options" class="wd-theme-options">
                <strong>Reel/Slideshow theme options</strong>
                <ul>
                    <li>
                        <span class="wd-label">
                            Player dimensions:
                        </span>
                        <span class="wd-value">
                            <input type="text" id="wd-width" name="width" value="<?php echo $width; ?>" />px wide &#215;
                            <input type="text" id="wd-height" name="height" value="<?php echo $height; ?>" />px tall
                        </span>
                    </li>
                    <li>
                        <span class="wd-label">
                            <input type="checkbox" id="wd-autoplay" name="autoplay" />
                            <label for="wd-autoplay">Autoplay</label>
                        </span>
                    </li>
                    <li>
                        <span class="wd-label">
                            <input id="wd-enablethumbs" name="enablethumbs" type="checkbox" checked />
                            <label for="wd-enablethumbs">Enable thumbnail tray</label>
                        </span>
                        <ul>
                            <li>
                                <input id="wd-hidethumbs" name="hidethumbs" type="checkbox" />
                                <label for="wd-hidethumbs">Collapsible tray</label>
                            </li>
                            <li>
                                <input id="wd-reel-credit-label" name="creditlabel" type="checkbox" />
                                <label for="wd-reel-credit-label">Show credit label</label>
                            </li>
                            <li>
                                Show <input id="wd-reel-credit-count" type="text" value="1" /> credit(s)
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div id="wd-gallery-options" class="wd-theme-options wd-hidden">
                <strong>Gallery theme options</strong>
                <ul>
                    <li>
                        <span class="wd-label">
                            Thumbnail dimensions:
                        </span>
                        <span class="wd-value">
                            <input type="text" id="wd-thumbwidth" name="thumbwidth" value="180" />px wide &#215;
                            <input type="text" id="wd-thumbheight" name="thumbheight" value="180" />px tall
                        </span>
                    </li>
                    <li>
                        <span class="wd-label">Thumbnail strategy:</span>
                        <span class="wd-value">
                            <select id="wd-thumbfit" name="thumbfit">
                                <option value="scale">Scale</option>
                                <option value="crop">Crop</option>
                            </select>
                        </span>
                    </li>
                    <li>
                        <input id="wd-letterbox" name="letterbox" type="checkbox" />
                        <label for="wd-letterbox">Center-align thumbnail (may cause letterboxing)</label>
                    </li>
                    <li>
                        <input id="wd-linebreak-enabled" type="checkbox" />
                        <input type="text" id="wd-linebreak" name="linebreak" value="4" disabled />
                        <label for="wd-linebreak-enabled">thumbnails per row</label>
                    </li>
                    <li>
                        <input id="wd-gallery-credit-label" name="creditlabel" type="checkbox" />
                        <label for="wd-gallery-credit-label">Show credit label</label>
                    </li>
                    <li>
                        Show <input type="text" id="wd-gallery-credit-count" name="creditcount" value="1" /> credit(s) in modal player
                    </li>
                </ul>
            </div>

            <div class="wd-help">
                <a target="_new" href="http://labs.wiredrive.com/wordpress/classic2/">What does it all mean?</a>
            </div>
        </div>
    </div>
</div>
