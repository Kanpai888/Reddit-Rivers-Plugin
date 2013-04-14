(function() {
  
  // The constructor is required and will be given a delegate that can perform
  // certain actions which are specific to this plugin.
  var SubReddit = function(delegate) {
    this.delegate = delegate;
    // Initialisation
  };
 
  // Called to find out how to create a new stream instance.
  SubReddit.prototype.authRequirements = function(callback) {
    // Do auth setup if required
    callback({
      authType: "basic",
      fields: [
      	{
      		"label": "subreddit",
      		"type": "url",
      		"identifier": "subreddit",
      		"value": "http://www.reddit.com/r/funny/new.json"
      	}
      ]
    });
  };
 
  // Called with auth details to create a new account
  SubReddit.prototype.authenticate = function(params) {
    // Get more user details if necessary
    this.delegate.createAccount({
      name: "Some Subreddit",
      identifier: params.subreddit,
      secret: params.subreddit
    });
  };
 
  // Return a list of notifications.
  SubReddit.prototype.update = function(user, callback) {
  	var self = this;
  	// Shortcut for GET
  	HTTP.get(user.secret, function(err, response) {
  	  
  		if (err) {
  	      // console.log(err);
  	      callback(err, null);
  	      return;
  	    }

  	    var data = JSON.parse(response);
  	    var entries = data["data"]["children"];
  	    var processed = [];
  	    for (var i = 0; i < 10; i++) {
  	      var s = new Text();
  	      s.text = "<b>Reddit - " + entries[i]["data"]["title"] + "</b>";
  	      s.id = entries[i]["data"]["author"];
  	      processed.push(s);
  	    }
  	    callback(null, processed);


  	});

  };
 
  // Called by River to determine how often it should update streams from this
  // plugin.
  SubReddit.prototype.updatePreferences = function(callback) {
    callback({
      'interval': 15,
      'min': 10,
      'max': 100
    });
  };
 

 
  PluginManager.registerPlugin(SubReddit, 'net.kanpaitek.SubReddit');
 
})();