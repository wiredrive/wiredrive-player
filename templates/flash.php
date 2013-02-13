<?php // Included into and inherits scope of player.php
    $containerId = uniqid('wd-flash-');
?>
<script type="text/javascript">
(function () {
    "use strict";

    //TODO: see if there is a way to set src and poster after init.
    //that information will no longer be available to us at load time.
    //If there isn't a way to set them after swfobject, then move the swfobject code
    //into the Player object and have it draw it
    var flashvars = {
            //src: '<?= urlencode(html_entity_decode($link)); ?>',
            //poster: '<?= urlencode(html_entity_decode($thumbnail)); ?>',
            backgroundColor: '<?= $options['stage_color']; ?>'
        },
        params = {
            allowFullScreen: 'true',
            allowscriptaccess: 'always'
        },
        attributes = {};

    window.swfobject.embedSWF(
        '<?= $pluginUrl; ?>/flash/StrobeMediaPlayback.swf',
        '<?= $containerId; ?>',
        '100%',
        '100%',
        '10.1.0',
        '<?= $pluginUrl; ?>/flash/expressInstall.swf',
        flashvars,
        params,
        attributes,
        function (e) {
            //remember: no assurance that jQuery has loaded yet.
            var player = WDP.getPlayer('<?= $attributeId; ?>');
            
            player.attachPlayer(document.getElementById(e.id));
            player.isDataLoaded() && player.setReady();
        }
    );
}());
</script>
<div id="<?= $containerId; ?>">
    You don't seem to have flash
</div>
