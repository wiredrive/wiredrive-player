</div><!-- End Stage Div-->

<div class='wd-credits-container
<?php if ( count($this->get('items')) == 1 || ($this->get('hidethumbs') == 'on') ) : ?>
 hide-thumbs
<?php endif; ?>'>
    <span class="wd-title"></span>
    <span class="wd-credit"></span>
    <div class="wd-thumb-dropdown"></div>
</div>

<?php $this->reset('items') ?>
<?php if ( count($this->get('items')) > 0 ) : ?>
<div class='wd-thumb-tray'>
    <div class='wd-nav-prev'></div>
    <div class='wd-nav-next'></div>

    <?php if ($this->get('items')) : ?>
    <div class='wd-thumb-list-container'>
        <ul class='wd-thumb-list'>
        <?php foreach ( $this->get('items') as $key=>$item ) : ?>           
            <li>
            <a
                href="<?php echo $item['link'] ?>"
                data-wd-item="<?php echo $key ?>"
                data-wd-title="<?php echo $item['title'] ?>"
                data-wd-credit="<?php echo $item['credit'] ?>"
                data-wd-description="<?php echo $item['description'] ?>"
                data-wd-source = "<?php echo $item['link'] ?>"
                data-wd-thumb = "<?php echo $item['thumbnail'] ?>"
                data-wd-height = "<?php echo $item['height'] ?>"
                data-wd-width = "<?php echo $item['width'] ?>"
                data-wd-credits = "<?php //echo json_encode($item['credits'] )?>"    
            >
            <img class='wd-thumb' src="<?php echo $item['thumbnail'] ?>">
            </a>
            </li>
            
        <?php endforeach; ?>
        </ul>
        
    </div>
    <?php endif; ?>
    
</div>
<?php endif; ?>