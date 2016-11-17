(function ( $ ) {
 
    $.window = function(el,options) {
        var plugin = this;
        var $el = $(el);

        plugin.options = $.extend({
           
        }, options);

        plugin.methods = {
            content : function(){
                return $el.find('.window-content').first();
            },
            open : function(){
                return plugin.open();
            },
            close : function(){
                return plugin.close();
            }
        }

        
        plugin.init = function() {           
           var $window = $(
                            '<header class="window-header">'+
                                '<nav class="window-controls">'+
                                '<span class="control-item control-minimize js-minimize">‒</span>'+
                                '<span class="control-item control-maximize js-maximize">□</span>'+
                                '<span class="control-item control-close js-close">˟</span>'+
                            '</nav>'+
                            '</header>'+
                            '<main class="window-content">'+                                
                            '</main>'
                        );
            $el.append($window);
            $el.addClass('window');
            plugin.initEventHandlers();
            
        }
        plugin.initEventHandlers = function(){
            $el.find(".js-minimize").click(plugin.minimize);
            $el.find(".js-maximize").click(plugin.maximize);
            $el.find(".js-close").click(plugin.close);
            if(plugin.options.shortcut){
                $(plugin.option.shortcut).click(plugin.open);
            }
            $el.mousedown(function(){
                $("[name*='window']").removeClass("window--active");
                $(this).addClass("window--active");
            });            
            $el.not(".window--maximized").not(".window--minimize").resizable({
                minWidth: 450,
                minHeight: 250,
                resizestart : plugin.startResizing,
                resizestop : plugin.stopResizing,
            });
            $el.not(".window--minimize").draggable({
                handle: ".window-header",
                start: plugin.startMoving,
                stop: plugin.stopMoving
            });
        }
        plugin.minimize = function() {
            $el.removeClass("window--maximized");
            $el.toggleClass("window--minimized");
        }
        plugin.maximize = function() {
            $el.removeClass("window--minimized");
            $el.toggleClass("window--maximized");
        }
        plugin.close = function() {
            $el.addClass("window--destroyed");
            $el.removeClass("window--maximized window--minimized");
        }
        plugin.open = function() {
            $el.removeClass("window--destroyed");
        }
        plugin.startMoving = function(){
            $el.addClass("window--moving");
            $el.removeClass("window--maximized");

            
        }
        plugin.stopMoving = function(){
            $el.removeClass("window--moving");
        }
        plugin.startResizing = function(){
            $el.addClass("window--resizing");
        }
        plugin.stopResizing = function(){
            $el.removeClass("window--resizing");
        }

        if(options == false){
            return {
                methods:  plugin.methods
            }
        }else{
            plugin.init();
        }
        
    };



    $.fn.window = function(options) {
        var pluginName = 'window';
        if(typeof options == 'object' | typeof options == 'undefined'){
            return this.each(function() {   
                var upgraded =  $(this).attr('upgraded');
                
                if (upgraded != undefined) {   
                    if(upgraded.indexOf(pluginName + ',') == -1){
                        var plugin = new $.window(this, options);
                        $(this).attr('upgraded', upgraded + pluginName+',');
                    } 
                }else{
                    var plugin = new $.window(this, options);
                    $(this).attr('upgraded', pluginName+',');
                }
            });
        }else if(typeof options == 'string'){
            if($(this).attr('upgraded') == undefined){
                console.error('Plugin not initialized');
            }else{
                var method = $.window(this.first(), false).methods[options];
                if(!method){
                    console.error('Unknown method');
                    return;
                }
                return method.call();
            }
            
        }

        console.error('Bad parameters');

    } 
}( jQuery ));