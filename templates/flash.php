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
params.wmode = 'transparent';
params.devicefont = 'true';
params.swliveconnect = 'true';
params.allowscriptaccess = 'sameDomain';
params.allowFullScreen = 'true';
params.play = 'true';
var attributes = {};
attributes.id = '<?php echo $this->get('attributeId') ?>';
attributes.styleclass = 'wd-video-player';
swfobject.embedSWF('<?php echo $this->get('pluginUrl') ?>/flash/wiredrivePlayer.swf', 'no-flash-content', '100%', '100%', '10.0.0', 'expressInstall.swf', flashvars, params,attributes);
</script>

<div id='no-flash-content'>
    <p>You require either a HTML5 capable browser or Adobe Flash to view this video content. Please click an icon to install.</p>
	<br />
    <a class='wdp-chrome' href='http://www.google.com/chrome/' alt='Install Google Chrome' target='_blank'>
        <img src='<?php echo $this->get('pluginUrl') ?>/images/chrome_icon.png'>
    </a>
    <a class='wdp-flash' href='http://get.adobe.com/flashplayer' alt='Install Flash Player' target='_blank'>
        <img src='<?php echo $this->get('pluginUrl') ?>/images/flash_icon.png' >
    </a>

    <script type='text/javascript'>
        jQuery('.wd-stage').css('background', 'none');
    </script>

</div>
