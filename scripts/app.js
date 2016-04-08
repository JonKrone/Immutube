/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'player'
, 'io'
, 'bacon'
, 'http'
], function($, _, P, Maybe, Player, io, bacon, http) {
  'use strict';
  io.extendFn();

  // HELPERS ///////////////////////////////////////////
  var compose = P.compose;
  var map = P.map;
  var log = function(x) { console.log(x); return x; }
  var fork = _.curry(function(f, future) { return future.fork(log, f); })
  var setHtml = _.curry(function(sel, x) { return $(sel).html(x); });

  const getDom = $.toIO();
  const listen = _.curry((type, el) => Bacon.fromEventTarget(el, type));

  // PURE //////////////////////////////////////////////////

  const targetValue = compose(_.get('value'), _.get('target'));
  const termUrl = function(term) {
    return 'https://www.googleapis.com/youtube/v3/search?' +
      $.param({part: 'snippet', q: term, key: api_key});
  };

  // :: Entry -> HTML
  const entryToLi = function(el) {
    return $('<li />', { "data-youtubeid": el.id.$t, text: el.title.$t });
  }

  const keyupStream = listen('keyup');
  const valueStream = compose(map(targetValue), keyupStream);
  const urlStream = compose(map(termUrl), valueStream);
  const searchStream = compose(map(http.getJSON), urlStream);

  const liStream = compose(map(entryToLi), searchStream);

  

  // IMPURE /////////////////////////////////////////////////////

  getDom('#search').map(searchStream).runIO().onValue(fork(setHtml('#results')));

});


//  api_key :: String
var api_key = 'AIzaSyAWoa7aqds2Cx_drrrb5FPsRObFa7Dxkfg';


//+ render :: Entry -> Dom
var render = function(e) {
  return $('<li/>', {text: e.snippet.title, 'data-youtubeid': e.id.videoId});
};
