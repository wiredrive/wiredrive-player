<div class="hidden">
    <div id="wdp-dialog">
        <div class="wdp-dialog-content">
            <div id="wdp-dialog-message">
                <p>Please enter the address of the mRSS feed you'd like to display. Video feeds may only contain video files. Image feeds may only contain image files (JPG, GIF or PNG).</p>
                <p><strong>Example:</strong></p>
                <p><code>http://merc.wiredrive.com/l/p/?presentation=e0da2c4c8488d56ab3cf09adfa21fa0a</code></p>
            </div>
            <p><input type="text" id="wdp-dialog-feed" style="width:98%" /></p>
            <p><strong>Set dimensions for your player:</strong></p>
            <p>Leave blank to use the default dimensions; select <strong>Wiredrive Player</strong> from the <strong>Settings menu</strong> in WordPress to set default dimensions.</p>
            <p><input type="text" id="wdp-dialog-width" class="wdp-dialog-dim" style="width:50px" /> &#215; 
               <input type="text" id="wdp-dialog-height" class="wdp-dialog-dim" style="width:50px" /> pixels</p>
            <p>[width] &#215; [height]</p>
            <div class="wdp-display-options">
                <p><strong>Choose a player display:</strong></p>
                    <input type="radio" id="wdp-theme-player" name="wdp-theme" value="inline-player" checked/> Standard Inline<br />
                    <input type="radio" id="wdp-theme-popup" name="wdp-theme" value="popup" /> Overlay gallery; tiles thumbnails at 180px wide or tall<br />
                    <input type="radio" id="wdp-theme-popup" name="wdp-theme" value="popup box-thumbs" /> Gallery with letterbox, pillarbox<br />                
                </p>
            </div>
            <div class="wdp-thumbnail-options">
                <p><strong>Thumbnail Options:</strong></p>
                <p><input type="checkbox" id="wdp-hide-thumbs"/> Expandable thumbnail tray<br />
                   <input type="checkbox" id="wdp-disable-thumbs"/> Disable thumbnails and credits<br />
                   <input type="checkbox" id="wdp-auto-slideshow"/> Slideshow mode (image feeds only)</p>
            </div>               
        </div>
    </div>
</div>