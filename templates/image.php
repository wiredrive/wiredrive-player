<div class='video-js-box'>
THIS IS IMAGE
    <video id="<?php echo $this->get('attributeId') ?>" class='video-js wd-video-player' src="<?php echo $this->get('link') ?>" controls 
                            poster="<?php echo $this->get('thumbnail') ?>" 
                            width="<?php echo $this->get('width') ?>" 
                            height="<?php echo $this->get('height') ?>"
                            preload="none"
                            rel="0"
                            >;
    </video>
</div>