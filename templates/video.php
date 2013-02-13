<?php // Included into and inherits scope of player.php ?>
<!-- TODO: remove src and poster. they will not be available at load time -->
       <!-- src="<?= $link; ?>" -->
       <!-- poster="<?= $thumbnail; ?>" -->
<video class="wd-video"
       width="<?= $width; ?>"
       height="<?= $height; ?>"
       preload="none"
       x-webkit-airplay="allow">
</video>
<div class="wd-play-button"></div>
