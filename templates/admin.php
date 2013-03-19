<?php
    $height = $this->get('height');
    $width = $this->get('width');
    $duration = $this->get('slideshowDuration');
    $pluginUrl = $this->get('pluginUrl');
?>

<script type="text/javascript">
(function () {
    "use strict";

    WDPA.defaults = {
        slideshowDuration: <?= $duration; ?>,
        height: <?= $height; ?>,
        width: <?= $width; ?>
    };

    WDPA.proxyUrl = '<?= $pluginUrl; ?>/proxy.php';
}());
</script>
