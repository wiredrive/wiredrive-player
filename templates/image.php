<?php // Included into and inherits scope of player.php ?>
<div class="wd-image-container" style="height: <?= $height; ?>; width: <?= $width; ?>;">
    <?php
    // Don't even think about adding an empty src tag to this image.
    // Data about the image to display comes from jsonp and is added later.
    // In case you didn't know, an image tag with a src of `src=""` means
    // "My source is the page I'm currently on, so it will make another request
    // to this very page once for every image player you have on the page.
    // So, yeah, leave out the empty src tag
    ?>
    <img class="wd-image" />
</div>
