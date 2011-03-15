<?
$options = $this->get('options');
?>
<style type="text/css">
.wd-stage {
    width: <?php echo $options['wdp_width'] ?>;
    height: <?php echo $options['wdp_height'] ?>;
    background: <?php echo $options['wdp_stage_color'] ?>;
}
.wd-credits-container {
    background: <?php echo $options['wdp_credit_container_color'] ?>;
    border-top: 1px solid <?php echo $options['wdp_credit_container_border'] ?>;
    text-align: <?php echo $options['wdp_credit_container_alignment'] ?>;
}
<?php if( $options['wdp_credit_container_alignment'] == 'Right') : ?>
.hide-thumbs .wd-credits-container {
    padding-right: 35px;
}
<?php endif; ?>
.wd-nav-prev, .wd-nav-next, .wd-thumb-tray {
    background: <?php echo $options['wdp_thumb_bg_color'] ?>;
}
.wd-left-arrow {
    border-color: transparent <?php echo $options['wdp_arrow_color'] ?> transparent transparent;
}
.wd-right-arrow { 
    border-color: transparent transparent transparent <?php echo $options['wdp_arrow_color'] ?>;
}
.wd-thumb-list .wd-active {
    border: 1px solid <?php echo $options['wdp_active_item_color'] ?>;
}
.wd-title {
    color: <?php echo $options['wdp_title_color'] ?>;
    font-size: <?php echo $options['wdp_title_font_size'] ?>;
}
.wd-credit {
    color: <?php echo $options['wdp_credit_color'] ?>;
    font-size: <?php echo $options['wdp_credit_font_size'] ?>;
}
.box-thumbs .wd-thumb-list li a {
    background: rgba(0, 0, 0, <?php echo $options['wdp_thumb_box_opacity'] ?>);
}
</style>