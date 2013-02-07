(function(){
    tinymce.create('tinymce.plugins.wdpButton', {
 
        init : function(ed, url){
			//if ( typeof WDButtonClick == 'undefined' ) return;
			
            ed.addButton('mce-wdp-button', {
                title: 'Wiredrive Player',
                image: url + '/../images/button.png',
                onclick : function() {
					WDPButtonClick();
				}
            });
        },
        createControl : function(n, cm){
            return null;
        },
        getInfo : function(){
            return {
                longname: 'Wiredrive Video Player Button',
                author: 'Wiredrive',
                authorurl: 'http://wiredrive.com',
                infourl: 'http://wiredrive.com',
                version: "2.2.5"
            };
        }
    });
    tinymce.PluginManager.add('wdpButton', tinymce.plugins.wdpButton);
})();
