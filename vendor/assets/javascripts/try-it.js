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
      self.jasmine.getEnv().addReporter(new self.jasmine.TrivialReporter({
        location: window.document.location,
        body: $('.spec-runner')[0]
      }));
      self.jasmine.getEnv().addReporter(new StylishReporter());
        // execute jasmine spec
        self.execute(specText);

        // execute user code
        //codeText = "panda = 'happy';"
        console.log('tryit'+codeText);
        self.execute(codeText);

      self.jasmine.getEnv().execute();
    };
    self.execute = function(editor) {
      //get text of editor and store in localStorage of client
      console.log("execute");
      //console.log(specText);
      //var script = editor.getSession().getValue();
      console.log(editor);
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


  //Eventy stuff
  $('html, body').add(document.body).keydown(function(e){
    if(e.which === 13 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      tryIt();
    }
  });
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
  clicker('.button.insert',function() {
    editors.get('specs').insert($(this).data(editors.getMode()+'-snippet'));
  });
  clicker('.clear-saved',function() {
    _(editors.names).each(function(name) {
      delete localStorage[name];
    });
    $(this).hide();
    editors.setMode('javascript');
    templates.init();
  });

  clicker('.scroll-to-results',function() {
    $('#__jasmine_TrivialReporter_showPassed__').attr('checked','checked').trigger('click').attr('checked','checked');
    window.scrollTo(0,$('.jasmine_reporter').offset().top);
  });
  clicker('.flip-editors',function() {
    arrangeEditors(localStorage['verticalSplit'] === "false" ? true : false)
  });

  var arrangeEditors = function(vertical) {
    $('.editor-wrapper').toggleClass('vertical',vertical);
    $('.editor').toggleClass('vertical',vertical);
    editors.each(function(editor) {
      editor.resize();
    });
    localStorage['verticalSplit'] = vertical;
  };

  var loadGists = (function() {
    var idMatches = window.location.search.match(/gist=(\w*)/);
    if(idMatches) {
      $.getJSON('/gists/'+idMatches[1],function(json) {
        $(function() {
          var specs = '',
              src = '',
              containsCoffee = false;
          _(json.files).each(function(file,name) {
            if(name.indexOf('.coffee') !== -1) {
              containsCoffee = true;
            }

            if(name.match(/spec\.(js|coffee)/)) {
              specs += file.content + '\n';
            } else {
              src += file.content + '\n';
            }
          });
          editors.setMode(containsCoffee? 'coffee' : 'javascript');

          editors.get("specs").getSession().setValue(specs);
          editors.get("src").getSession().setValue(src);

        });
      });
    }
  })();

  var StylishReporter = function() {};
  StylishReporter.prototype.reportRunnerStarting = function() {
    $('body').removeClass();
    $('.body-wrap').removeClass('passing-border','failing-border');
  };


  if(!window.runningTryJasmineSpecs) {
    $(document).ready(function(){

    });
  }
})(jQuery);
