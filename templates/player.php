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

    $jsonpUrl = $this->get('jsonpUrl');
    $options = $this->get('options');
    $width = $this->get('width');
    $height = $this->get('height');
    $type = $this->get('type'); //which player template to use
    $attributeId = $this->get('attributeId'); //random wordpress id for something
?>
<div id="<?= $attributeId; ?>" class="wd-player">
    <div class="wd-stage" style="width: <?= $width; ?>; height: <?= $height; ?>;"></div>
    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?= $attributeId; ?>',
                type: '<?= $type; ?>',
                jsonpUrl: '<?= $jsonpUrl; ?>'
            });
        }());
    </script>
</div>
