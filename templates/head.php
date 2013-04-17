<?php
    $options = $this->get('options');
    $pluginUrl = $this->get('pluginUrl');
?>

<script type="text/javascript">
(function () {
    "use strict";

    window.WDP.options = <?php echo json_encode($options); ?>;
    window.WDP.options.pluginUrl = '<?php echo $pluginUrl; ?>';
}());
</script>

<style type="text/css">
/*
 * Theme styles
 */
.wd-player .wd-stage,
.wd-player .wd-poster {
    background-color: <?php echo $options['stage_color']; ?>;
}

.wd-player .wd-credit-tray {
    background-color: <?php echo $options['credit_container_color']; ?>;
    text-align: <?php echo $options['credit_container_alignment']; ?>;
    border-top: 1px solid <?php echo $options['credit_container_border']; ?>;
    color: <?php echo $options['credit_color']; ?>;
    font-size: <?php echo $options['credit_font_size']; ?>px;
}

.wd-player .wd-triangle.left {
    border-right-color: <?php echo $options['arrow_color']; ?>;
}

.wd-player .wd-triangle.right {
    border-left-color: <?php echo $options['arrow_color']; ?>;
}

.wd-player .wd-title {
    color: <?php echo $options['title_color']; ?>;
    font-size: <?php echo $options['title_font_size']; ?>px;
}

.wd-player .wd-flash-replace {
    color: <?php echo $options['title_color']; ?>;
}

/* inline player styles */
.wd-player.inline-player .wd-thumb-tray {
    background-color: <?php echo $options['thumb_bg_color']; ?>;
}

.wd-player.inline-player .wd-thumb-tray li img {
    border: 1px solid <?php echo $options['thumb_bg_color']; ?>;
}

.wd-player.inline-player .wd-thumb-tray li img.selected {
    border: 1px solid <?php echo $options['active_item_color']; ?>;
}

/* Gallery styles */
.wd-player.gallery-player .wd-thumb-tray.letterbox li {
    background-color: #111;
    background-image: url("about:blank");
    background-color: rgba(17, 17, 17, <?php echo $options['thumb_box_opacity']; ?>);

}
</style>
<!--[if lt ie 9]>
<style type="text/css">
.wd-player.gallery-player .wd-thumb-tray.letterbox li {
    background-color: transparent\9;
    /* ohai IE8 (which unfortunately is also picked up by IE9, hence the conditional) */
    <?php
        $hex = sprintf(
            '%02s',
            dechex(round(255 * ((float) $options['thumb_box_opacity'] * 100) / 100, 0))
        );
    ?>
    -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(startColorStr=#<?php echo $hex; ?>111111,endColorStr=#<?php echo $hex; ?>111111)';
    background-attachment: scroll\9;
    background-repeat: repeat\9;
    background-position-x: 0%\9;
    background-position-y: 0%\9;

</style>
<![endif]-->
