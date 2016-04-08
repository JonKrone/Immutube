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

  // PURE //////////////////////////////////////////////////

  const getDom = $.toIO();
  const listen = _.curry((type, el) => Bacon.fromEventTarget(el, type));

  const keypressStream = listen('keyup');
  const targetValue = compose(_.get('value'), _.get('target'));
  const valueStream = compose(map(targetValue), keypressStream);

  const urlStream = 



  // IMPURE /////////////////////////////////////////////////////

  getDom('#search').map(valueStream).runIO().onValue(log);

});


//  api_key :: String
var api_key = 'AIzaSyAWoa7aqds2Cx_drrrb5FPsRObFa7Dxkfg';

//+ termToUrl :: String -> URL
var termToUrl = function(term) {
  return 'https://www.googleapis.com/youtube/v3/search?' +
    $.param({part: 'snippet', q: term, key: api_key});
};

//+ render :: Entry -> Dom
var render = function(e) {
  return $('<li/>', {text: e.snippet.title, 'data-youtubeid': e.id.videoId});
};
