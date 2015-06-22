

 $(function(){
    
    /**
     * onlslider change move the selected object
     */
    $('.slider').change(function(e){

        var selectedObj = 'cylinder';

        var _type = $(this).data('type'),
            _dir  = $(this).data('value'),
            _val  = $(this).val();

        console.log( _type, _dir, _val )

        App.sceneObjects[selectedObj][_type][_dir] = _val;

    });

 });