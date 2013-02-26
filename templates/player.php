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
    $duration = $this->get('duration');

    $jsonpUrl = $this->get('jsonpUrl');
    $options = $this->get('options');
    $width = $this->get('width');
    $height = $this->get('height');
    $type = $this->get('type'); //which player template to use
    $attributeId = $this->get('attributeId'); //some kind of wordpress id that works well as the container id
?>
<div id="<?= $attributeId; ?>" class="wd-player <?= $theme; ?>" style="width: <?= $width; ?>px;">
    <div class="wd-stage" style="height: <?= $height; ?>px;">
        <div class="wd-paginate previous-arrow"></div>
        <div class="wd-paginate next-arrow"></div>
        <div class="wd-play-slideshow-button"></div>
    </div>

    <? if (!$disableThumbs): ?>
    <div class="wd-thumb-tray<?= $collapseThumbs ? ' collapsed' : ''; ?>" style="width: <?= $width; ?>px;">
        <div class="wd-carousel-bb">
            <ol class="wd-carousel"></ol>
        </div>
        <div class="wd-carousel-button previous disabled">
            <div class="wd-triangle left"></div>
        </div>
        <div class="wd-carousel-button next">
            <div class="wd-triangle right"></div>
        </div>
    </div>
    <div class="wd-credit-tray">
        <span class="wd-title">&nbsp;</span>
        <span class="wd-credit">&nbsp;</span>
        <? if ($collapseThumbs): ?>
        <div class="wd-thumb-collapse collapsed">
            <div class="wd-triangle down"></div>
        </div>
        <? endif; ?>
    </div>
    <? endif; ?>

    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?= $attributeId; ?>',
                type: '<?= $type; ?>',
                width: '<?= $width; ?>',
                height: '<?= $height; ?>',
                slideshow: <?= $slideshow ? 'true' : 'false'; ?>,
                duration: <?= $duration; ?>,
                autoplay: <?= $autoplay ? 'true' : 'false'; ?>,
                loop: <?= $loop ? 'true' : 'false'; ?>,
                jsonpUrl: '<?= $jsonpUrl; ?>'
            });
        }());
    </script>
</div>
