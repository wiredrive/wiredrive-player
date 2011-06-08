<div class="wd-play-prev"></div>
<div class="wd-play-next wd-active"></div>
</div><!-- End Stage Div-->

<?php $this->reset('items') ?>
<?php if ( count($this->get('items')) > 0 ) : ?>
<div class='wd-thumb-tray'>
    <div class='wd-nav-prev'><span class="wd-left-arrow"></span></div>
    <div class='wd-nav-next'><span class="wd-right-arrow"></span></div>

    <?php if ($this->get('items')) : ?>
    <div class='wd-thumb-list-container'>
        <ul class='wd-thumb-list'>
        <?php foreach ( $this->get('items') as $key=>$item ) : ?>
            <li>
                <a
                    href="<?php echo $item['link'] ?>"
                    data-wd-item="<?php echo $key ?>"
                    data-wd-title="<?php echo htmlentities($item['title']) ?>"
                    <?php if (isset($item['credits'])) : ?>data-wd-credit="<?php echo current($item['credits']); ?>"
                    <?php endif; ?>data-wd-description="<?php echo htmlentities($item['description']) ?>"
                    data-wd-source = "<?php echo $item['link'] ?>"
                    data-wd-thumb = "<?php echo $item['thumbnail_lg'] ?>"
                    data-wd-height = "<?php echo $item['height'] ?>"
                    data-wd-width = "<?php echo $item['width'] ?>"                  
                    data-wd-credits = '<?php echo json_encode($item['credits']) ?>'
                    data-wd-keywords = '<?php echo json_encode($item['keywords']) ?>'
                >
                    <img 
                        class='wd-thumb' 
                        src="<?php echo $item['thumbnail_sm'] ?>" 
                        data-thumb-width = "<?php echo $item['thumbnail_sm_width'] ?>" 
                        data-thumb-height = "<?php echo $item['thumbnail_sm_height'] ?>"
                    >
                    
                    <div class="hover-credits">
                        <span class="wd-title"><?php echo htmlentities($item['title']) ?></span><br />
                        <span class="wd-credit">
                        	<?php 
                        		if( !empty($item['credits']) ) {
		                        	echo array_shift($item['credits']);
                        		}
                        	?>
                        </span>

                    </div>
                </a>
            </li>
            
        <?php endforeach; ?>
        </ul>
        
    </div>
    <?php endif; ?>
    
</div>
<?php endif; ?>

<div class='wd-credits-container
<?php if ( count($this->get('items')) == 1 || ($this->get('hidethumbs') == 'on') ) : ?>
 hide-thumbs
<?php endif; ?>'>
    <div class="wd-credits">
        <span class="wd-title"></span>
        <span class="wd-credit"></span>
    </div>
    <div class="wd-thumb-dropdown"></div>
</div>