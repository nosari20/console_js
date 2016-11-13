var $terminal = $('.terminal-window').window().window('content').terminal({
    prog :[
        {
            command : "custom",
            help : "custom",
            program : function(prompt,args){
                prompt.out("This is a custom command");
                
            }
        },
        {
            command : "in",
            help : "in",
            program : function(prompt,args){
                prompt.out("Type something");
                prompt.in(function(input){
                    prompt.out(input);
                    prompt.exit();
                });
                
                
            }
        },
        {
            command : "exec",
            help : "exec",
            program : function(prompt,args){
                prompt.exec('echo','plop');                
                
            }
        }
         
    ]
});
