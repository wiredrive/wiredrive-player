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
    $linebreak = $this->get('linebreak');
    $thumbWidth = $this->get('thumbWidth');
    $isLetterbox = $this->get('isLetterbox');
    $thumbHeight = $this->get('thumbHeight');
    $isIPad = $this->get('isIPad');
    $thumbfit = $this->get('thumbfit');
    $duration = $this->get('duration');
    $showCreditLabel = $this->get('creditLabel');
    $creditCount = $this->get('creditCount');
    $isMobile = $this->get('isMobile');
    $jsonpUrl = $this->get('jsonpUrl');
    $options = $this->get('options');
    $width = $this->get('width');
    $height = $this->get('height');
    $type = $this->get('type'); //which player template to use
    $attributeId = $this->get('attributeId'); //some kind of wordpress id that works well as the container id
?>
<div id="<?= $attributeId; ?>" class="wd-player">
    <?php if ($theme === 'inline-player'): ?>
    <div class="wd-stage">
        <div class="wd-paginate previous-arrow"></div>
        <div class="wd-paginate next-arrow"></div>
        <div class="wd-play-slideshow-button"></div>
    </div>
    <?php endif; ?>

    <?php if ($theme === 'inline-player' && !$disableThumbs): ?>
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
    <div class="wd-credit-tray<?= $collapseThumbs ? ' collapsible' : ''; ?>">
        <div class="wd-title">&nbsp;</div>
        <?php if ($collapseThumbs): ?>
        <div class="wd-thumb-collapse collapsed">
            <div class="wd-triangle down"></div>
        </div>
        <?php endif; ?>
    </div>
    <?php endif; ?>

    <?php if ($theme === 'gallery-player'): ?>
    <div class="wd-thumb-tray<?= $isLetterbox ? ' letterbox' : ''; ?>">
        <div class="wd-carousel-bb">
            <ol class="wd-carousel"></ol>
        </div>
    </div>
    <?php endif; ?>

    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?= $attributeId; ?>',
                type: '<?= $type; ?>',
                theme: '<?= $theme; ?>',
                isMobile: <?= $isMobile ? 'true' : 'false'; ?>,
                width: '<?= $width; ?>',
                height: '<?= $height; ?>',
                slideshow: <?= $slideshow ? 'true' : 'false'; ?>,
                duration: <?= $duration; ?>,
                loop: <?= $loop ? 'true' : 'false'; ?>,
                creditCount: <?= $creditCount; ?>,
                showCreditLabel: <?= $showCreditLabel ? 'true' : 'false'; ?>,
            <?php if ($theme === 'inline-player'): ?>
                autoplay: <?= $autoplay ? 'true' : 'false'; ?>,
            <?php else: ?>
                galleryThumbWidth: <?= $thumbWidth; ?>,
                galleryThumbHeight: <?= $thumbHeight; ?>,
                thumbfit: '<?= $thumbfit; ?>',
                linebreak: <?= $linebreak; ?>,
            <?php endif; ?>
                jsonpUrl: '<?= $jsonpUrl; ?>'
            });
        }());
    </script>
</div>
