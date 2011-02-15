<script>
var params = {};
params.menu = 'false';
params.wmode = 'transparent';
params.devicefont = 'true';
params.swliveconnect = 'true';
params.allowscriptaccess = 'sameDomain';
params.play = 'true';
var attributes = {};
attributes.id = '<?php echo $this->get('attributeId') ?>';
attributes.styleclass = 'wd-video-player';
swfobject.embedSWF('<?php echo $this->get('pluginUrl') ?>/<?php echo $this->get('asset_dir') ?>/<?php echo $this->get('title') ?>', 'no-flash-content', '100%', '100%', '10.0.0', 'expressInstall.swf', flashvars, params,attributes);
</script>

<div id='no-flash-content'>
    <p>You require either a HTML5 capable browser or Adobe Flash to view this video content. Please click an icon to install.</p>
	<br />
    <a class='wdp-safari' href='http://www.apple.com/safari/download/' target='_blank'>
        <img src='<?php echo $this->get('pluginUrl') ?>/images/safari_icon.png'>
    </a>
    <a class='wdp-flash' href='http://get.adobe.com/flashplayer' target='_blank'>
        <img src='<?php echo $this->get('pluginUrl') ?>/images/flash_icon.png' >
    </a>
</div>
