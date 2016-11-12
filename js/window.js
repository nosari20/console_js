(function ( $ ) {
 
    $.window = function(el,options) {
        var plugin = this;
        var $el = $(el);

        plugin.options = $.extend({
           
        }, options);

        
        plugin.init = function() {
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
                alsoResize: ".window--active .window-content",
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

        plugin.init();
    };



    $.fn.window = function(options) {
        return this.each(function() {   
            var upgraded =  $(this).attr('upgraded');
            var pluginName = 'window';
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

    } 
}( jQuery ));