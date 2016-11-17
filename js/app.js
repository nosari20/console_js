var $terminal = $('.terminal-window').window().window('content').terminal({
    prompt : ">",
    prog :[
        {
            command : "custom",
            help : "custom",
            program : function(prompt,args){
                prompt.out("This is a custom command");
                load(function(){
                    prompt.out("The end");
                });


                function load(callback){
                    prompt.out("");
                    prompt.wait();
                    function loading(load, string){
                        prompt.clearLastLine();                                       
                        if(load >= 30){
                            prompt.out(string); 
                            prompt.exit();
                            callback();

                        }else{
                            prompt.out(string); 
                            setTimeout(function(){
                                loading(load+1, string+"=");
                            },100);
                        }
                    }
                    setTimeout(function(){
                        loading(0,"");
                    },100);
                }
                
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
        },
        {
            command : "test",
            help : "test",
            program : function(prompt,args){
                prompt.clearLastLine();               
                
            }
        }
         
    ]
});
