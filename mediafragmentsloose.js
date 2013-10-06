//Known implemented multimedia sharing apps:
// Youtube: #t=1h20m1s or #t=3902 or query with the same syntax
// Dailymotion: ?start=1234
// Vimeo: #t=1234

//tested media fragment uris
// ==== YouTube =======
// ==== youtube.com, youtu.be=====
// pass http://www.youtube.com/watch?v=Wm15rvkifPc#t=120
// pass http://www.youtube.com/watch?v=Wm15rvkifPc?pass http://www.youtube.com/watch?v=Wm15rvkifPc#t=120t=120
// pass http://www.youtube.com/watch?v=Wm15rvkifPc&t=1h9m20s
// pass http://www.youtube.com/watch?v=Wm15rvkifPc#t=1h9m20s
// fail http://www.youtube.com/watch?v=Wm15rvkifPc#t=1h96m20s
// fail http://www.youtube.com/watch?v=Wm15rvkifPc#t=1h6m80s

// ==== Dailymotion =======
// ==== dailymotion.com, dai.ly=====
// pass http://www.dailymotion.com/video/xjwusq&start=120
// pass http://www.dailymotion.com/video/xjwusq?start=120

// ==== Anyfile =======
// pass http://example.com/example.webm?t=clock:2011-10-01T23:00:45.123Z,2011-10-01T23:00:45.123Z#xywh=pixel:10,10,30,30

// ==== Vimeo =======
// ==== vimeo.com=====
// pass http://vimeo.com/812027#t=214

// ==== viddler =======
// pass http://www.viddler.com/v/bb2a72e9?offset=12.083&secret=32758627

// ==== tudou =======
// pass http://www.tudou.com/listplay/H9hyQbAj4NM/2tzZHTtq4GA.html?lvt=30

// ==== youku =======
// ==== youku.com, youku.tv=====
// pass http://v.youku.com/v_show/id_XNjE2OTQ0MTI4.html?ev=5&firsttime=147

// ==== 56.com =======
// pass http://www.56.com/u92/v_OTgwMTk4NDk.html#st=737

// ==== vbox7.com =======
// pass http://vbox7.com/play:8f5daa4c00?start=200


//Afreeca sorry don't know Korean
//Archive.org no
//blip.tv no
//blogTV = younow no
//break.com no
//buzznet no
//comedy.com no
//crackle no
//dacast no
//EngageMedia no
//ExpoTV no
//Facebook video no
//funnyordie.com
//funshion no
//flickr no
//fotki no
//godtube no
//hulu.com Someone in U.S. can test for me?
//lafango no
//LeTV no
//liveleak no
//Mail.ru no
//MaYoMo domain expire
//Mefeedia, only in U.S. same as Hulu
//metacafe no
//mobento no
//mevio no
//myspace no
//MyVideo no
//muzu.tv no
//nico nico douga no
//OneWorldTV no, not a video hosting site
//OpenFilm no
//ourmedia no, not a video hosting site
//panopto no, not public video
//photobucket no
//reeltime no, not video hosting site
//rutube.ru no
//Sapo Videos no
//SchoolTube no
//ScienceStage no
//Sevenload no
//SmugMug no, not a video hosting site
//Tape.tv no, not available in UK
//ted no
//trilulilu no
//tropptube no, not a video hosting site
//veoh.com no
//videojug no
//videolog no
//videoosh no
//viki no, but timed comments

var MediaFragmentsLoose = (function(window) {
  
  //  "use strict";  

  // Yunjia Li:
  // Reuse parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License

  var parseUri = function(str){
    var options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };
    var o   = options,
      m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
      uri = {},
      i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
  };

  // Yunjia Li: convert ZhYmXs youtube time fragment format to hh:mm:ss
  var hmsToNPT = function(str){
    var hhmmssRaw = str.toLowerCase().replace("s",'').replace("m",":").replace("h",":");
    var hhmmssArr = hhmmssRaw.split(":");
    var npt="";
    for (var i =0;i<hhmmssArr.length;i++)
    {
      var t = hhmmssArr[i]
      if(t.length == 1)
      {
        t="0"+t;
      }
      npt+=t;
      if(i!==hhmmssArr.length-1)
        npt+=":";
    }
    return npt;
  }

  // Yunjia Li: map the attributes used in various website into the Media Fragment specification
  var mapAttributes = function(key,host){
    // Yunjia Li: for dailymotion media fragment &start=seconds
    if (key === "start" && (host.indexOf("dailymotion")!==-1 || host.indexOf("dai.ly")!==-1))
      return "t";
    else if (key === "start" && host.indexOf("vbox7.com")!==-1 )
      return "t";
    else if (key === "offset" && host.indexOf("viddler")!==-1) {
      return "t";
    }
    else if (key === "lvt" && host.indexOf("tudou")!==-1) { // tudou
      return "t";
    }
    else if (key === "firsttime" && host.indexOf("youku")!==-1) { // youku
      return "t";
    }
    else if (key==="st" && host.indexOf("56.com")!==-1){
      return "t";
    }
    else
      return key;
  }
  
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp */) {
      "use strict";
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function") {
        throw new TypeError();
      }
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          fun.call(thisp, t[i], i, t);
        }
      }
    };
  }
  
  // '&' is the only primary separator for key-value pairs
  var SEPARATOR = '&';  
  
  // report errors?
  var VERBOSE = true;
  
  var logWarning = function(message) {
    if (VERBOSE) {
      console.log('Media Fragments URI Parsing Warning: ' + message);
    }
  }
  
  // the currently supported media fragments dimensions are: t, xywh, track, id
  // allows for O(1) checks for existence of valid keys
  var dimensions = {
    t: function(value) {          
      var components = value.split(',');
      if (components.length > 2) {
        return false;
      }
      var start = components[0]? components[0] : '';
      // Yunjia Li: if XhYmZs format, e.g. YouTube time format such as 1m2s
      if(start.indexOf("s") !== -1)
        start = hmsToNPT(start); 

      // Yunjia Li: No media as far as I know support end time yet, so ignore the hmsToNPT function
      var end = components[1]? components[1] : '';
      if ((start === '' && end === '') ||
          (start && !end && value.indexOf(',') !== -1)) {
        return false;
      }
      // hours:minutes:seconds.milliseconds
      var npt = /^((npt\:)?((\d+\:(\d\d)\:(\d\d))|((\d\d)\:(\d\d))|(\d+))(\.\d*)?)?$/;
      if ((npt.test(start)) &&
          (npt.test(end))) {
        start = start.replace(/^npt\:/, '');
        // replace a sole trailing dot, which is legal:
        // npt-sec = 1*DIGIT [ "." *DIGIT ]
        start = start.replace(/\.$/, '');
        end = end.replace(/\.$/, '');
        var convertToSeconds = function(time) {
          if (time === '') {
            return false;
          }
          // possible cases:
          // 12:34:56.789
          //    34:56.789
          //       56.789
          //       56
          var hours;
          var minutes;
          var seconds;
          time = time.split(':');          
          var length = time.length;
          if (length === 3) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseFloat(time[2]);
          } else if (length === 2) {
            var hours = 0;
            var minutes = parseInt(time[0], 10);
            var seconds = parseFloat(time[1]);
          } else if (length === 1) {
            var hours = 0;
            var minutes = 0;            
            var seconds = parseFloat(time[0]);
          } else {
            return false;
          }
          
          // Yunjia Li: hours could be bigger than 23 hours
          //if (hours > 23) {
          //  logWarning('Please ensure that hours <= 23.');                      
          //  return false;              
          //}         

          if (minutes > 59) {
            logWarning('Please ensure that minutes <= 59.');                      
            return false;
          }
          if (seconds >= 60 && 
            (hours !== 0 || minutes !== 0)) {
            logWarning('Please ensure that seconds < 60.');                      
            return false;
          }    
          return hours * 3600 + minutes * 60 + seconds;
        };
        var startNormalized = convertToSeconds(start);
        var endNormalized = convertToSeconds(end);
        if (start && end) {
          if (startNormalized < endNormalized) {
            return {
              value: value,
              unit: 'npt',
              start: start,
              end: end,
              startNormalized: startNormalized,
              endNormalized: endNormalized
            };
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;            
          }           
        } else {
          if ((convertToSeconds(start) !== false) ||
              (convertToSeconds(end) !== false)) {
            return {
              value: value,
              unit: 'npt',
              start: start,
              end: end,
              startNormalized: startNormalized === false ? '' : startNormalized,
              endNormalized: endNormalized === false ? '' : endNormalized,
            };
          } else {
            logWarning('Please ensure that start or end are legal.');                                                      
            return false;
          }
        }
      }
      // hours:minutes:seconds:frames.further-subdivison-of-frames
      var smpte = /^(\d+\:\d\d\:\d\d(\:\d\d(\.\d\d)?)?)?$/;      
      var prefix = start.replace(/^(smpte(-25|-30|-30-drop)?).*/, '$1');
      start = start.replace(/^smpte(-25|-30|-30-drop)?\:/, '');      
      if ((smpte.test(start)) && (smpte.test(end))) {
        // we interpret frames as milliseconds, and further-subdivison-of-frames
        // as microseconds. this allows for relatively easy comparison.
        var convertToSeconds = function(time) {
          if (time === '') {
            return false;
          }
          // possible cases:
          // 12:34:56
          // 12:34:56:78
          // 12:34:56:78.90          
          var hours;
          var minutes;
          var seconds;
          var frames;
          var subframes;
          time = time.split(':');          
          var length = time.length;
          if (length === 3) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseInt(time[2], 10);
            frames = 0;
            subframes = 0;
          } else if (length === 4) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseInt(time[2], 10);
            if (time[3].indexOf('.') === -1) {
              frames = parseInt(time[3], 10);
              subframes = 0;
            } else {
              var frameSubFrame = time[3].split('.');
              frames = parseInt(frameSubFrame[0], 10);
              subframes = parseInt(frameSubFrame[1], 10);              
            }
          } else {
            return false;
          }
          if (hours > 23) {
            logWarning('Please ensure that hours <= 23.');                      
            return false;              
          }          
          if (minutes > 59) {
            logWarning('Please ensure that minutes <= 59.');                      
            return false;
          }
          if (seconds > 59) {
            logWarning('Please ensure that seconds <= 59.');                      
            return false;
          }    
          return hours * 3600 + minutes * 60 + seconds +
              frames * 0.001 + subframes * 0.000001;
        };        
        if (start && end) {
          if (convertToSeconds(start) < convertToSeconds(end)) {
            return {
              value: value,
              unit: prefix,
              start: start,
              end: end
            };            
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;
          }
        } else {
          if ((convertToSeconds(start) !== false) ||
              (convertToSeconds(end) !== false)) {
            return {
              value: value,
              unit: prefix,
              start: start,
              end: end
            };                      
          } else {
            logWarning('Please ensure that start or end are legal.');                                                      
            return false;
          }
        }
      }
      // regexp adapted from http://delete.me.uk/2005/03/iso8601.html
      var wallClock = /^((\d{4})(-(\d{2})(-(\d{2})(T(\d{2})\:(\d{2})(\:(\d{2})(\.(\d+))?)?(Z|(([-\+])(\d{2})\:(\d{2})))?)?)?)?)?$/;      
      console.log("start:"+start);
      start = start.replace('clock:', '');
      if ((wallClock.test(start)) && (wallClock.test(end))) {
        // the last condition is to ensure ISO 8601 date conformance.
        // not all browsers parse ISO 8601, so we can only use date parsing
        // when it's there.
        if (start && end && !isNaN(Date.parse('2009-07-26T11:19:01Z'))) {
          // if both start and end are given, then the start must be before
          // the end
          if (Date.parse(start) <= Date.parse(end)) {            
            return {
              value: value,
              unit: 'clock',
              start: start,
              end: end
            };            
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;
          }
        } else {
          return {
            value: value,
            unit: 'clock',
            start: start,
            end: end
          };          
        }
      }
      logWarning('Invalid time dimension.');                                                
      return false;
    },
    xywh: function(value) {
      // "pixel:" is optional
      var pixelCoordinates = /^(pixel\:)?\d+,\d+,\d+,\d+$/;
      // "percent:" is obligatory
      var percentSelection = /^percent\:\d+,\d+,\d+,\d+$/;
      
      var values = value.replace(/(pixel|percent)\:/, '').split(','); 
      var x = values[0];
      var y = values[1];
      var w = values[2];
      var h = values[3];                              
      if (pixelCoordinates.test(value)) {             
        if (w > 0 && h > 0) {
          return {
            value: value,
            unit: 'pixel',          
            x: x,
            y: y,
            w: w,
            h: h
          };
        } else {
          logWarning('Please ensure that w > 0 and h > 0');                                      
          return false;          
        }
      } else if (percentSelection.test(value)) {
        /**
         * checks for valid percent selections
         */
        var checkPercentSelection = (function checkPercentSelection(
            x, y, w, h) {
          if (!((0 <= x) && (x <= 100))) { 
            logWarning('Please ensure that 0 <= x <= 100.');                                      
            return false;
          }
          if (!((0 <= y) && (y <= 100))) { 
            logWarning('Please ensure that 0 <= y <= 100.');                                      
            return false;
          }
          if (!((0 <= w) && (w <= 100))) { 
            logWarning('Please ensure that 0 <= w <= 100.');                                      
            return false;
          }
          if (!((0 <= h) && (h <= 100))) { 
            logWarning('Please ensure that 0 <= h <= 100.');                                      
            return false;
          }            
          return true;            
        });        
        if (checkPercentSelection(x, y, w, h)) {
          return {
            value: value,
            unit: 'percent',          
            x: x,
            y: y,
            w: w,
            h: h
          };
        }
        logWarning('Invalid percent selection.');                                      
        return false;
      } else {
        logWarning('Invalid spatial dimension.');                                      
        return false;
      }
    },
    track: function(value) {
      return {
        value: value,
        name: value
      };
    },
    id: function(value) {
      return {
        value: value,
        name: value
      };
    },
    chapter: function(value) {          
      return {
        value: value,
        chapter: value
      };
    }
  }      
  
  /**
   * splits an octet string into allowed key-value pairs
   * Yunjia Li: add uriComponents
   */
  var splitKeyValuePairs = function(octetString, uriComponents) {
    var keyValues = {};
    var keyValuePairs = octetString.split(SEPARATOR);    
    keyValuePairs.forEach(function(keyValuePair) {      
      // the key part is up to the first(!) occurrence of '=', further '='-s
      // form part of the value
      var position = keyValuePair.indexOf('=');
      if (position < 1) {
        return;
      } 
      var components = [
          keyValuePair.substring(0, position),
          keyValuePair.substring(position + 1)];
      // we require a value for each key
      if (!components[1]) {
        return;
      }
      // the key name needs to be decoded
      var key = mapAttributes(decodeURIComponent(components[0]), uriComponents.host);

      // only allow keys that are currently supported media fragments dimensions
      var dimensionChecker = dimensions[key];
      // the value needs to be decoded
      var value = decodeURIComponent(components[1]);
      if (dimensionChecker) {
        value = dimensionChecker(value);
      } else {
        // we had a key that is not part of media fragments
        return;
      }
      if (!value) {
        return;
      }                        
      // keys may appear more than once, thus store all values in an array,
      // the exception being &t
      if (!keyValues[key]) {
        keyValues[key] = [];
      }
      if (key !== 't') {
        keyValues[key].push(value);
      } else {
        keyValues[key][0] = value;
      }
    });
    return keyValues;
  }  
  
  return {
    parse: function(opt_uri) {
      return MediaFragments.parseMediaFragmentsUri(opt_uri);
    },
    parseMediaFragmentsUri: function(opt_uri) {    
      var uri = opt_uri? opt_uri : window.location.href;
      // retrieve the query part of the URI 
      var uriComponents = parseUri(uri); 

       //Yunjia Li: seems a weired bug for dailymotion, the start query is not after a questionmark in uri but right attached as &start:
      if((uriComponents.host.indexOf("dailymotion.com") !== -1 || uriComponents.host.indexOf("dai.ly") !== -1)&&
          uriComponents.path.indexOf("?") === -1 && uriComponents.path.indexOf("&start=") !== -1){ //treat such as an uri query
        uri = uri.replace("&start=","?start=");
        uriComponents = parseUri(uri);
      }


      //var indexOfHash = uri.indexOf('#');
      //var indexOfQuestionMark = uri.indexOf('?');
      //var end = (indexOfHash !== -1? indexOfHash : uri.length);
      //var query = indexOfQuestionMark !== -1?
      //    uri.substring(indexOfQuestionMark + 1, end) : '';
      // retrieve the hash part of the URI
      //var hash = indexOfHash !== -1? uri.substring(indexOfHash + 1) : '';

      var query = "",
          hash = "",
          queryValues = {},
          hashValues = {};

      // Yunjia Li: check first if the protocal of the uri is http or https
      if(uriComponents.protocol !== "http" && uriComponents.protocol !== "https"){
        logWarning("Invalid URI: The URI should use http or https protocol");
      }
      else{
        query = uriComponents.query;
        hash = uriComponents.anchor;
        queryValues = splitKeyValuePairs(query, uriComponents);
        hashValues = splitKeyValuePairs(hash, uriComponents);
      }

      return {
        provider: uriComponents.host,
        query: queryValues,
        hash: hashValues,
        toString: function() {
          var buildString = function(name, thing) {
            var s = '\n[' + name + ']:\n';
            if(!Object.keys) Object.keys = function(o){            
              if (o !== Object(o)) {
                throw new TypeError('Object.keys called on non-object');
              }
              var ret = [], p;
              for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
              }
              return ret;
            }            
            Object.keys(thing).forEach(function(key) {
              s += '  * ' + key + ':\n';
              thing[key].forEach(function(value) {
                s += '    [\n';
                Object.keys(value).forEach(function(valueKey) {
                  s += '      - ' + valueKey + ': ' + value[valueKey] + '\n';
                });
                s += '   ]\n';
              }); 
            });
            return s;
          }
          var string =
              'Provider:'+uriComponents.host+
              buildString('Query', queryValues) +
              buildString('Hash', hashValues);
          return string; 
        }      
      };
    }
  }
})(window);