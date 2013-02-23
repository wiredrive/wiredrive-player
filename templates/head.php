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
.wd-player {
    margin-top: 0px;
    margin-bottom: 1em;
}

.wd-player .wd-stage {
    background-color: <?= $options['stage_color']; ?>;
    position: relative;
    overflow: hidden;
    width: 100%;
}

.wd-player .wd-thumb-tray {
    background-color: <?= $options['thumb_bg_color']; ?>;
}

.wd-player .wd-thumb-tray li img {
    border: 1px solid <?= $options['thumb_bg_color']; ?>;
}

.wd-player .wd-thumb-tray li img.selected {
    border: 1px solid <?= $options['active_item_color']; ?>;
}
</style>
