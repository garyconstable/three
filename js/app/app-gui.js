

'use strict';

var app = app || {};

var App = App || {};

/**
* Load the scene
* ==
*/
app.prototype.loadDefaultScene = function()
{
  //$("#pageLoad").load("/projects/particles/particles.html");
  $("#pageLoad").load("/projects/maze/maze.html");

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
};
/**
* Slider Update
* ==
*/
app.prototype.sliderUpdate = function(el, value)
{
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
/**
* Bind gui events
* ==
*/
app.prototype.bindings = function()
{
    var _this = this;

    $(document).on('change', '.slider', function(e){
      var _elem = $(this),
          _type = $(_elem).data('type'),
          _dir  = $(_elem).data('value');

      _this.setStorage( _type, _dir, $(this).val() );
    });

    $(document).on('click', '#sidebar-toggle', function(e){
        if( $('#sidebar').css('left') === '0px' ){
            $('#sidebar').css({ left :'-250px'});
            $('#console').css({ right :'-450px'});
        }else{
            $('#sidebar').css({left: 0});
            $('#console').css({ right : '15px'});
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
}
/**
*
* ==
*/
app.prototype.addObjectToObjectSelect = function(name)
{
  if ( $("#objectSelect option[value='"+name+"']").length < 1 ){
    $('#objectSelect').append($('<option>', { value : name }).text(name));
  }
};
