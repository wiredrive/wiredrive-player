<div class="hidden">
    <div id="wdp-dialog">
        <div class="wdp-dialog-content">
            <div id="wdp-dialog-message">
                <p>Please enter the address of the mRSS feed you'd like to display. Video feeds may only contain video files. Gallery feeds may only contain image files (JPG, GIF or PNG).</p>
                <p><strong>Example:</strong></p>
                <p><code>http://www.wdcdn.net/rss/presentation/library/client/marketing/id/7adabb5d31dfe08e3379cb08590331fe/</code></p>
            </div>
            <p><input type="text" id="wdp-dialog-feed" style="width:98%" /></p>
            <p><strong>Set dimensions for your player:</strong></p>
            <p>If left blank, the player defaults to those set on the settings page.</p>
            <p><input type="text" id="wdp-dialog-width" class="wdp-dialog-dim" style="width:50px" /> &#215; 
               <input type="text" id="wdp-dialog-height" class="wdp-dialog-dim" style="width:50px" /> pixels</p>
            <p>[width] &#215; [height]</p>
            <p><strong>Thumbnail Options:</strong></p>
            <p><input type="checkbox" id="wdp-hide-thumbs"/> Hide thumbnail tray<br />
               <input type="checkbox" id="wdp-disable-thumbs"/> Disable thumbnails & credits<br />
               <input type="checkbox" id="wdp-auto-slideshow"/> Slideshow mode (gallery feeds only)</p>
            <p><strong>Display the player as a:</strong></p>
                <input type="radio" id="wdp-theme-player" name="wdp-theme" value="inline-player" checked/> Inline Player<br />
                <input type="radio" id="wdp-theme-popup" name="wdp-theme" value="popup" /> Grid<br />
                <input type="radio" id="wdp-theme-popup" name="wdp-theme" value="popup box-thumbs" /> Grid with 1:1 thumbnails<br />                
            </p>
        </div>
    </div>
</div>