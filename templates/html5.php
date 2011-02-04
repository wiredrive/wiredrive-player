<div class='video-js-box'>
    <video id="<?php echo $this->get('attributeId') ?>" class='wd-video-player' src="<?php echo $this->get('link') ?>" controls 
                            poster="<?php echo $this->get('thumbnail') ?>" 
                            width="<?php echo $this->get('width') ?>" 
                            height="<?php echo $this->get('height') ?>"
                            preload="none"
                            >;
    </video>
</div>