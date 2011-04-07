<?php
$options = $this->get('options');
?>
<style type="text/css">
.wd-player {
    width: <?php echo $options['width'] . 'px' ?>;
}
.wd-stage {
    width: <?php echo $options['width'] . 'px' ?>;
    height: <?php echo $options['height'] . 'px'?>;
    background: <?php echo $options['stage_color'] ?>;
}
.wd-credits-container {
    background: <?php echo $options['credit_container_color'] ?>;
    border-top: 1px solid <?php echo $options['credit_container_border'] ?>;
    text-align: <?php echo $options['credit_container_alignment'] ?>;
}
<?php if( $options['credit_container_alignment'] == 'Right') : ?>
.hide-thumbs .wd-credits-container {
    padding-right: 35px;
}
<?php endif; ?>
.wd-nav-prev, .wd-nav-next, .wd-thumb-tray {
    background: <?php echo $options['thumb_bg_color'] ?>;
}
.wd-left-arrow {
    border-color: transparent <?php echo $options['arrow_color'] ?> transparent transparent;
}
.wd-right-arrow { 
    border-color: transparent transparent transparent <?php echo $options['arrow_color'] ?>;
}
.wd-thumb-list .wd-active {
    border: 1px solid <?php echo $options['active_item_color'] ?>;
}
.wd-title {
    color: <?php echo $options['title_color'] ?>;
    font-size: <?php echo $options['title_font_size'] . 'px' ?>;
}
.wd-credit {
    color: <?php echo $options['credit_color'] ?>;
    font-size: <?php echo $options['credit_font_size'] . 'px' ?>;
}
.box-thumbs .wd-thumb-list li a {
    background-color: #111111;
    background-color: rgba(17, 17, 17, <?php echo $options['thumb_box_opacity'] ?>);
}
</style>
