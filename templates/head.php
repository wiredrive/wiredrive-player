<?php
    $options = $this->get('options');
    $pluginUrl = $this->get('pluginUrl');
?>

<script type="text/javascript">
(function () {
    "use strict";

    window.WDP.options = <?= json_encode($options); ?>;
    window.WDP.options.pluginUrl = '<?= $pluginUrl; ?>';
}());
</script>

<style type="text/css">
/*
 * Theme styles
 */
.wd-player .wd-stage {
    background-color: <?= $options['stage_color']; ?>;
}

.wd-player .wd-credit-tray {
    background-color: <?= $options['credit_container_color']; ?>;
    text-align: <?= $options['credit_container_alignment']; ?>;
    border-top: 1px solid <?= $options['credit_container_border']; ?>;
}

.wd-player .wd-triangle.left {
    border-right-color: <?= $options['arrow_color']; ?>;
}

.wd-player .wd-triangle.right {
    border-left-color: <?= $options['arrow_color']; ?>;
}

.wd-player .wd-title {
    color: <?= $options['title_color']; ?>;
    font-size: <?= $options['title_font_size']; ?>px;
}

.wd-player .wd-flash-replace {
    color: <?= $options['title_color']; ?>;
}

.wd-player .wd-credit {
    color: <?= $options['credit_color']; ?>;
    font-size: <?= $options['credit_font_size']; ?>px;
}

/* inline player styles */
.wd-player.inline-player .wd-thumb-tray {
    background-color: <?= $options['thumb_bg_color']; ?>;
}

.wd-player.inline-player .wd-thumb-tray li img {
    border: 1px solid <?= $options['thumb_bg_color']; ?>;
}

.wd-player.inline-player .wd-thumb-tray li img.selected {
    border: 1px solid <?= $options['active_item_color']; ?>;
}

/* Gallery styles */
.wd-player.gallery-player .wd-thumb-tray.letterbox li {
    background-color: #111;
    background-color: rgba(17, 17, 17, <?= $options['thumb_box_opacity']; ?>);

    /* ohai IE8 (which unfortunately is also picked up by IE9) :P */
    <? $hex = dechex($options['thumb_box_opacity'] * 100); ?>
    filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#<?= $hex; ?>111111,endColorStr=#<?= $hex; ?>111111);
    background-image: url("about:blank");
    background-attachment: scroll\9;
    background-repeat: repeat\9;
    background-position-x: 0%\9;
    background-position-y: 0%\9;
    background-color: transparent\9;
}
</style>
