<?php
    /*
     * Settings
     */
    $collapseThumbs = $this->get('collapseThumbs'); //is the thumbnail tray collapseable
    $disableThumbs = $this->get('disableThumbs'); //is there even a thumbnail tray to begin with?
    $slideshow = $this->get('slideshow');
    $autoplay = $this->get('autoplay');
    $loop = $this->get('loop');
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
    <div class="wd-stage" style="width: <?= $width; ?>px; height: <?= $height; ?>px;">
        <div class="wd-paginate previous-arrow"></div>
        <div class="wd-paginate next-arrow"></div>
        <div class="wd-play-slideshow-button"></div>
    </div>
    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?= $attributeId; ?>',
                type: '<?= $type; ?>',
                width: '<?= $width; ?>',
                height: '<?= $height; ?>',
                slideshow: <?= $slideshow ? 'true' : 'false'; /* php is a stupid stupid language */?>,
                autoplay: <?= $autoplay ? 'true' : 'false'; ?>,
                loop: <?= $loop ? 'true' : 'false'; ?>,
                jsonpUrl: '<?= $jsonpUrl; ?>'
            });
        }());
    </script>
</div>
