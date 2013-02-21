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
                    <code>http://iowa.wiredrive.com/present-library-gallery/token/128b053b916ea1f7f20233e8a26bc45d</code>
                    <code>http://www.wdcdn.net/rss/presentation/library/client/iowa/id/128b053b916ea1f7f20233e8a26bc45d</code>
                </p>
            </div>

            <p><input type="text" id="wd-dialog-feed" style="width:98%" /></p>

            <div class="wd-dimensions-options">
                <p><strong>Set dimensions for your player:</strong></p>
                <p>Select <strong>Wiredrive Player</strong> from the <strong>Settings menu</strong> in WordPress to set default dimensions.</p>
                <p>
                    <input type="text" id="wd-dialog-width" class="wd-input-number" style="width:50px" value="<?= $width; ?>"/> &#215; 
                    <input type="text" id="wd-dialog-height" class="wd-input-number" style="width:50px" value="<?= $height; ?>" /> pixels</p>
                <p>[width] &#215; [height]</p>
            </div>

            <div class="wd-display-options">
                <p><strong>Choose a player display:</strong></p>
                    <input type="radio" id="wd-theme-player" name="wd-theme" value="inline-player" checked/>
                    <label for="wd-theme-player"> Standard inline<br /></label>
                <!--
                    <input type="radio" id="wd-theme-grid" name="wd-theme" value="grid" /><label for="wd-theme-grid"> Overlay gallery; tiles thumbnails at 180px wide or tall<br /></label>
                    <input type="radio" id="wd-theme-grid-box" name="wd-theme" value="grid box-thumbs" /><label for="wd-theme-grid-box"> Gallery with letterbox, pillarbox<br /></label>
                    <input type="radio" id="wd-theme-inline-grid" name="wd-theme" value="inline-grid" /><label for="wd-theme-inline-grid"> Inline video with thumbnails tiled below<br /></label>                                                -->
                </p>
            </div>

            <div class="wd-options">
                <p><strong>Other options:</strong></p>
                <p>
                    <ul>
                        <li>
                            <input type="checkbox" id="wd-enable-thumbs" checked />
                            <label for="wd-enable-thumbs"> Enable thumbnail and credits</label>
                            <ul>
                                <li>
                                    <input type="checkbox" id="wd-collapsable-thumbs" />
                                    <label for="wd-collapsable-thumbs"> Collapsable thumbnail tray</label>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <input type="checkbox" id="wd-slideshow" />
                            <label for="wd-slideshow"> Slideshow images</label>
                            <ul class="wd-disabled">
                                <li>
                                    <input disabled type="text" id="wd-slideshow-duration" class="wd-input-number" value="<?= $duration; ?>" />
                                    <label> Duration (seconds)</label>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <input type="checkbox" id="wd-autoplay" />
                            <label for="wd-autoplay"> Autoplay </label>
                        </li>
                        <li>
                            <input type="checkbox" id="wd-loop" />
                            <label for="wd-loop"> Loop</label>
                        </li>
                    </ul>
                </p>
            </div>               
        </div>
    </div>
</div>
