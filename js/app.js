var $window = $('.window').window();
var $terminal = $('.terminal').terminal({
    container : $window.find('.window-content'),
    prog :[
        {
            command : "custom",
            help : "custom",
            program : function(prompt,args){
                prompt.out("This is a custom command");
                
            }
        },
         
    ]
});