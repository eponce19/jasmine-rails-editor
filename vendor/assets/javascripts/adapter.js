(function($){
  window.tryIt = function() {
    $('.spec-runner,.runner-notice').removeClass('passing failing').html($('.loading.template').html());
    $('#sandbox').remove();
    $($('.sandbox.template').html()).appendTo('body').load(function() {
      $('.spec-runner').html('');
      Sandbox().runSpecs();
    });
  };

  //Define the little iframe sandbox
  window.Sandbox = function(){
    var self = $('#sandbox').get(0).contentWindow;

    self.runSpecs = function() {
      hideErrors();
      self.jasmine.getEnv().addReporter(new self.jasmine.JSONReporter({
        location: window.document.location,
        body: $('.spec-runner')[0]
      }));

        self.execute(specText);
        self.execute(codeText);

      self.jasmine.getEnv().execute();
    };
    self.execute = function(editor) {
      //get text of editor and store in localStorage of client
      var script = editor;
      // localStorage[editor.name] = script;
      try {
        self.eval(script);
      } catch(javaScriptError) {
        //Well, maybe it's just coffeescript.
        try {
          self.eval(CoffeeScript.compile(script, { bare: true }));
          editors.setMode('coffee');
        } catch(coffeeError) {
          var fullError = 'JavaScript Parse Error: '+javaScriptError+
                          '<br/>'+
                          'CoffeeScript Compile Error: '+coffeeError;
          showError(editor.name,fullError);
          throw fullError.replace(/\<br\/\>/g,"\n");
        }
      }
    };

    var hideErrors = function() {
      $('.flash').html('').hide();
      $('.error, .runner-wrap').removeClass('error');
    };

    // if specs have erros show this message
    var showError = function(name,fullError) {
      $('.flash').fadeIn().append("<li>Uh oh, it looks like your JavaScript "+(name === 'specs' ? 'specs have' : 'source has')+" a parse error!"+
          "<br/><br/>"+
          "<code>"+fullError+"</code>"+
          "</li>");
      $('.runner-wrap, #'+name).addClass('error');
    };

    return self;
  };

  $(document).on("change", $('#mode-select'), function(e){
    e.preventDefault();
    var $sel = $(this);
    editors.each(function(editor) {
      editor.switchMode($sel.val());
    });
  });
  var clicker = function(selector,action) {
    $(document).on("click", selector, function(e){
      e.preventDefault();
      action.apply(this,[e]);
    })
  };
  clicker('.try-it.button',function() {
    tryIt();
  });


  if(!window.runningTryJasmineSpecs) {
    $(document).ready(function(){

    });
  }
})(jQuery);
