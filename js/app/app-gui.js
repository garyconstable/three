

    'use strict';

    var app = app || {};
    
    
    
    
    app.prototype.loadDefaultScene = function(){
        
        $("#pageLoad").load("/projects/grid/grid.html");
        
        $('#projectSelect').change(function(e){
            
          if( $(this).val() !== 0  && $(this).val() !== '0'){
            var _this = $(this);
            $("#pageLoad").html();
            $('canvas').remove();
            
            var x = setTimeout(function(){
              console.log('load',  _this.val() )
              $("#pageLoad").load("/projects/" + _this.val() + "/" + _this.val() + ".html" );
            },500);
            
          }
          
        });  
    }
    

    app.prototype.sliderUpdate = function(el, value){

        var _elem = $(el),
            selectedObj = this.selectedObject;

        var _type = $(_elem).data('type'),
            _dir  = $(_elem).data('value'),
            _val  = value;
        
        if ( _type === 'rotation' ){
            _val = App.degToRadians(_val);
        }
        
        App.sceneObjects[selectedObj][_type][_dir] = _val;
    };
    
    
    
    
    
    app.prototype.bindings = function(){
        
        var _this = this;
        
        $(document).on('click', '#sidebar-toggle', function(e){
            if( $('#sidebar').css('left') === '0px' ){
                $('#sidebar').css({ left :'-250px'});
            }else{
                $('#sidebar').css({left: 0});
            }
        });
        
        $(document).on('change', '#objectSelect', function(e){
            _this.selectedObject = $(this).val();
        });
        
        
        $('.resetScene').click(function(e){
            console.log('clicked')
            e.preventDefault();
            localStorage.removeItem(_this.app_name);

            $("#pageLoad").html();
            $('canvas').remove();
            var x = setTimeout(function(){
              location.reload();
            },500);
            
        });
        
        
    };
    
    
    
    
    
    app.prototype.addObjectToObjectSelect = function(name){
        $('#objectSelect').append($('<option>', { value : name }).text(name)); 
    };

