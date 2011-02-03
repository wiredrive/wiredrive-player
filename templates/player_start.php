<!-- Begin Wiredrive Player -->
<div class='wd-player<?php if ($this->get('hidethumbs') == 'on') : ?> hide-thumbs<?php endif; ?><?php if ($this->get('mobile') == true) : ?> mobile<?php else : ?> not-mobile<?php endif; ?> <?php if ($this->get('slideshow') == 1) : ?>slideshow<?php else : ?>not-slideshow<?php endif; ?>' style='width:<?php echo $this->get('width') ?>;' >
<div class='wd-stage' 
        data-wd-item="0" 
        style='height:<?php echo $this->get('height') ?>; width:<?php echo $this->get('width') ?>; 
        '>