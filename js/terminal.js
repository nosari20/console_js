(function ( $ ) {
 
    $.terminal = function(el,options) {
        var plugin = this;
        var $el = $(el);
        var history = {
            commands : [],
            index : -1
        }
   
        /*
         * default command
         */
        var prog = [
               {
                   command : "echo",
                   help : "echo [string]",
                   program : function(prompt,args){
                       var text = "";
                       for(var w in args){
                           text += (args[w] + " ");
                       }
                       prompt.out(text);
                   }
                },
                {
                   command : "help",
                   program : function(prompt,args){
                       $.each(plugin.options.prog,function(index,value){
                           if(value.help){
                            prompt.out("- "+value.help);
                           }else{
                               prompt.out("- "+value.command);
                           }
                       });
                       
                   }
                },
                {
                   command : "moo",
                   program : function(prompt,args){
                      prompt.out("         (__)");
                      prompt.out("         (oo)");
                      prompt.out("   /------\/");
                      prompt.out("  / |    ||");
                      prompt.out(" *  /\---/\\");
                      prompt.out("    ~~   ~~");
                      prompt.out("....\"Have you mooed today?\"...");
                       
                   }
                }

        ];

        /*
         * Merge options commands and defaults and delete it from optons after
         */ 
        if(options.prog){
            prog = $.merge(prog, options.prog);
            delete options.prog;
        }      
        plugin.options = $.extend({
           prog : prog
        }, options);

        
        plugin.init = function() {
             plugin.initPrompt();
        }
        /*
         * Prompt
         */
        plugin.initPrompt = function(){
            plugin.prompt = $('<div class="prompt prompt"><pre>$ <span contenteditable="true" class="command"></span><span class="pulse">_</span></pre></div>') ;
            $el.append(plugin.prompt);
            $el.click(function(){
                plugin.focusPrompt();
            })

            plugin.prompt.find('.command').keypress(plugin.promptKeyPress);
            plugin.prompt.find('.command').keydown(plugin.promptKeyDown);

        }
        plugin.promptKeyPress = function(e){
            if (e.keyCode == 13) {
                e.preventDefault();                
                plugin.launch(plugin.prompt.find('.command').text());

            }
        }
        plugin.promptKeyDown = function(e){
            if(e.keyCode == 38){
                e.preventDefault();
                if(history.index > 0){
                    history.index -= 1;
                }
                plugin.setPrompt(history.commands[history.index]);
                plugin.focusPrompt();
            }
            if(e.keyCode == 40){
                e.preventDefault();
                if(history.index < history.commands.length){
                    history.index += 1;
                }
                plugin.setPrompt(history.commands[history.index]);
                plugin.focusPrompt();
            }
        }
        plugin.focusPrompt = function(){
            plugin.prompt.find('.command').focus();
            var textNode =  plugin.prompt.find('.command')[0].firstChild;
            var caret = textNode.length;
            var range = document.createRange();
            range.setStart(textNode, caret);
            range.setEnd(textNode, caret);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            
            
        }
        plugin.showPrompt = function(){
            plugin.emptyPrompt();
            plugin.prompt.show();
        }
        plugin.emptyPrompt = function(){
            plugin.prompt.find('.command').empty();
        }
        plugin.hidePrompt = function(){
            plugin.prompt.hide();
        }
        plugin.setPrompt = function(text){
            plugin.prompt.find('.command').text(text);
        }
        /*
         * Creation of line
         */
        plugin.createLine = function(content, color){
            if(color){
                return $('<div class="prompt" style="text-shadow: 0 0 0 '+color+ '"><pre>'+content+'</pre></div>');
            }
            return $('<div class="prompt"><pre>'+content+'</pre></div>');
        }
        plugin.createCommandLine = function(command){
            return $('<div class="prompt"><pre>$ <span class="command">'+command+'</span></pre></div>');
        }
        plugin.createErrorLine = function(content){
            return $('<div class="prompt error"><pre>'+content+'</pre></div>');
        }

        /*
         * Basic function of program
         */
        plugin.out = function(text, color){
           plugin.createLine(text, color).insertBefore(plugin.prompt);
        }
         plugin.err = function(text){
           plugin.createErrorLine(text).insertBefore(plugin.prompt);
        }


        /*
         * Execution
         */
        plugin.launch = function(text){
            plugin.hidePrompt();
            history.commands.push(text);
            history.index = history.commands.length;
            var tab = text.split(" ");
            var command = tab.shift();
            var parameters = tab;


            plugin.createCommandLine(text).insertBefore(plugin.prompt);

            var prog = plugin.eval(command);
            if(prog){
                plugin.execute(prog.program,parameters); 
            }else{
                plugin.showPrompt();
            }                         
            
        }

        plugin.execute = function(program,parameters){
            program(plugin, parameters);
            plugin.showPrompt();
            if(plugin.options.container){
                setTimeout( function() {
                    $(plugin.options.container).scrollTop($(plugin.options.container)[0].scrollHeight);
                }, 1 );
                
            }
            
        }

        plugin.eval =  function(command){
            var prog = plugin.options.prog.find(prog => {
                return prog.command == command;
            })

            if(prog != undefined){
                return prog;
            }else{
                plugin.err("Command &lt;" + command + "&gt; not found");
                return false;
            }

        }


        plugin.init();
    };



    $.fn.terminal = function(options) {
        return this.each(function() {    
            if ($(this).attr('upgraded') == undefined) {              
                var plugin = new $.terminal(this, options);
                $(this).attr('upgraded', 'true');
            }
        });

    } 
}( jQuery ));