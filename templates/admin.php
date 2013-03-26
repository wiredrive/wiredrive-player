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
        slideshowDuration: <?php echo $duration; ?>,
        height: <?php echo $height; ?>,
        width: <?php echo $width; ?>
    };

    WDPA.validatorUrl = '<?php echo admin_url('admin.php') ?>';
}());
</script>
