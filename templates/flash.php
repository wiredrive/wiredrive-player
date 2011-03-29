<?php
$options = $this->get('options'); 
?>
<script>
var flashvars = {};
flashvars.src = '<?php echo $this->get('link') ?>';
flashvars.scaleMode = 'fit';
flashvars.mode = 'overlay';
flashvars.playerID = '<?php echo $this->get('attributeId') ?>';
flashvars.autostart = 'false';
flashvars.loadImage = '<?php echo $this->get('thumbnail') ?>';
var params = {};
params.menu = 'false';
params.wmode = 'direct';
params.bgcolor = '<?php echo $options['stage_color'] ?>';
params.devicefont = 'true';
params.swliveconnect = 'true';
params.allowscriptaccess = 'sameDomain';
params.allowFullScreen = 'true';
params.hasPriority = "true";
var attributes = {};
attributes.id = '<?php echo $this->get('attributeId') ?>';
attributes.styleclass = 'wd-video-player';
swfobject.embedSWF('<?php echo $this->get('pluginUrl') ?>/flash/wiredrivePlayer.swf', 'no-flash-content', '100%', '100%', '10.1.0', '<?php echo $this->get('pluginUrl') ?>/flash/expressInstall.swf', flashvars, params, attributes);
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
