</div><!-- End Stage Div-->

<div class='wd-credits-container
<?php if ( count($this->get('items')) == 1 || ($this->get('hidethumbs') == 'on') ) : ?>
 hide-thumbs
<?php endif; ?>'>

    <div class="wd-thumb-dropdown"></div>
    
    <ul class='wd-credits'>
        <?php foreach ( $this->get('items') as $key=>$item ) : ?>   
        <li rel="<?php echo $key ?>">
            <h3 class='wd-title'><?php echo $item['title'] ?></h3>
            <h4 class='wd-credit'><?php echo $item['credit'] ?></h4>    
        </li>
        <?php endforeach; ?>
    </ul>
</div>

<?php $this->reset('items') ?>
<?php if ( count($this->get('items')) > 1 ) : ?>
<div class='wd-thumb-tray'>
    <div class='wd-nav-prev'></div>
    <div class='wd-nav-next'></div>

    <?php if ($this->get('items')) : ?>
    <div class='wd-thumb-list-container'>
        <ul class='wd-thumb-list'>
        <?php foreach ( $this->get('items') as $key=>$item ) : ?>           
            <li>
            <a href="<?php echo $item['link'] ?>" rel="<?php echo $key ?>">
            <img class='wd-thumb' src="<?php echo $item['thumbnail'] ?>">
            </a>
            </li>
            
        <?php endforeach; ?>
        </ul>
        
    </div>
    <?php endif; ?>
    
</div>
<?php endif; ?>