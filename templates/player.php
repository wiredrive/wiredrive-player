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
    $attributeId = $this->get('attributeId'); //some kind of wordpress id that works well as the container id
?>
<div id="<?php echo $attributeId; ?>" class="wd-player">
    <?php if ($theme === 'inline-player'): ?>
    <div class="wd-stage">
        <div class="wd-paginate previous-arrow"></div>
        <div class="wd-paginate next-arrow"></div>
        <div class="wd-play-slideshow-button"></div>
    </div>
    <?php endif; ?>

    <?php if ($theme === 'inline-player' && !$disableThumbs): ?>
    <div class="wd-thumb-tray<?php echo $collapseThumbs ? ' collapsed' : ''; ?>" style="width: <?php echo $width; ?>px;">
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
    <div class="wd-credit-tray<?php echo $collapseThumbs ? ' collapsible' : ''; ?>">
        <div class="wd-title">&nbsp;</div>
        <?php if ($collapseThumbs): ?>
        <div class="wd-thumb-collapse collapsed">
            <div class="wd-triangle down"></div>
        </div>
        <?php endif; ?>
    </div>
    <?php endif; ?>

    <?php if ($theme === 'gallery-player'): ?>
    <div class="wd-thumb-tray<?php echo $isLetterbox ? ' letterbox' : ''; ?>">
        <div class="wd-carousel-bb">
            <ol class="wd-carousel"></ol>
        </div>
    </div>
    <?php endif; ?>

    <script type="text/javascript">
        (function () {
            "use strict";

            window.WDP.registerPlayer({
                id: '<?php echo $attributeId; ?>',
                theme: '<?php echo $theme; ?>',
                width: '<?php echo $width; ?>',
                height: '<?php echo $height; ?>',
                slideshow: <?php echo $slideshow ? 'true' : 'false'; ?>,
                duration: <?php echo $duration; ?>,
                loop: <?php echo $loop ? 'true' : 'false'; ?>,
                creditCount: <?php echo $creditCount; ?>,
                showCreditLabel: <?php echo $showCreditLabel ? 'true' : 'false'; ?>,
            <?php if ($theme === 'inline-player'): ?>
                autoplay: <?php echo $autoplay ? 'true' : 'false'; ?>,
            <?php else: ?>
                galleryThumbWidth: <?php echo $thumbWidth; ?>,
                galleryThumbHeight: <?php echo $thumbHeight; ?>,
                thumbfit: '<?php echo $thumbfit; ?>',
                linebreak: <?php echo $linebreak; ?>,
            <?php endif; ?>
                jsonpUrl: '<?php echo $jsonpUrl; ?>'
            });
        }());
    </script>
</div>
