<?php
    /*
     * Settings
     */
    $collapseThumbs = $this->get('collapseThumbs'); //is the thumbnail tray collapseable
    $disableThumbs = $this->get('disableThumbs'); //is there even a thumbnail tray to begin with?
    $isSlideshow = $this->get('isSlideshow'); $autoslideshow = $this->get('autoslideshow'); //WTF is the difference?
    $theme = $this->get('theme'); //inline player, grid, etc
    $isMobile = $this->get('isMobile');
    $isIPad = $this->get('isIPad');

    $options = $this->get('options');
    $width = $this->get('width');
    $height = $this->get('height');
    $type = $this->get('type'); //which player template to use
    $attributeId = $this->get('attributeId'); //random wordpress id for something
    //$link = $this->get('link'); //link to first asset source
    //$thumbnail = $this->get('thumbnail'); //thumbnail for first asset
    //$items = $this->get('items'); //all media assets for this instance
    //$pluginUrl = $this->get('pluginUrl'); //baseUrl for the wiredrive-plugin install
?>
<div id="<?= $attributeId; ?>" class="wd-player">
    <div class="wd-stage" style="width: <?= $width; ?>; height: <?= $height; ?>;"></div>
    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?= $attributeId; ?>',
                type: '<?= $type; ?>',
                jsonpUrl: 'https://zurad.wiredrive.com/present-reel.jsonp/token/7471c24e071822e61c939149d71dd9fb'
            });
        }());
    </script>
</div>
