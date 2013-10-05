/*global define */
define(['app'], function () {
  'use strict';

  var
    scene7WidthParam = '?wid=',
    $imgSelector = $('.img-container noscript[data-src]'),
    imageSizes = {
      // defaults in pixelss
      mobile: 80,
      tablet: 160,
      desktop: 240
    },
    breakPoints = {
      // default media queries
      // 320 -> 768
      mobile: 'only all and (min-width: 20em) and (max-width: 48em)',
      // 768 -> 1024
      tablet: 'only all and (min-width: 48em) and (max-width: 64em)',
      // 1024+
      desktop: 'only all and (min-width: 64em)'
    },
    curBreakPoint = 'desktop';

  function isRetina() {
    var hiDef = false;
    try {
      var querys = [
        'only all and (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
        'only all and (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi)',
        'only all and (-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 124.8dpi)',
        'only all and (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi)'
      ];
      $.each(querys, function(index, val) {
        if (Modernizr.mq(val) === true) {
          hiDef = true;
          return false;
        }
      });
    } catch (ex) {
      console.log('isRetina(): ' + ex);
    }
    return hiDef;
  };

  function getBreakPoint() {
    var key = 'mobile';
    if (Modernizr.mq(breakPoints.desktop)) {
      key = 'desktop';
    } else if (Modernizr.mq(breakPoints.tablet)) {
      key = 'tablet';
    }
    return key;
  };

  function getImgWidth() {
    var imgWidth = 0;
    try {
      // determine break point
      var breakingPoint = getBreakPoint();
      // set img width
      imgWidth = imageSizes[breakingPoint];
    } catch (ex) {
      console.log('getImgWidth(): ' + ex);
    }
    return imgWidth;
  };

  function init(options) {
    // re-configure
    if (options !== undefined) {
      if (options.breakPoints !== undefined) {
        setBreakPoints(options.breakPoints);
      }
      if (options.imageSizes !== undefined) {
        setImageSizes(options.imageSizes);
      }
    }
    // determine if high res
    var isHiDef = isRetina();
    // calculate width of image
    var imgWidth = getImgWidth();
    var cssMaxWidth = Math.floor(imgWidth/16) + 'em';
    // loop through all images and display correct size
    $imgSelector.each(function(i, v) {
      var curSrc = $(v).attr('data-src');
      // check if retina image is needed
      if (isHiDef) {
        imgWidth *= 2;
      }
      // update parent's style
      $(v).parent().parent().width(cssMaxWidth);
      // check if image object exists
      var path = curSrc + scene7WidthParam + imgWidth;
      if ($(v).parent().find('img').length <= 0) {
        // create image object and set image src
        var imgObj = new Image();
        imgObj.src = path;
      } else {
        $(v).parent().find('img').attr('src', path);
      }
      // append to html
      $(v).before(imgObj);
    });
  };

  function setBreakPoints(opts) {
    breakPoints = $.extend(breakPoints, opts.breakPoints);
  };

  function setImageSizes(opts) {
    imageSizes = $.extend(imageSizes, opts.imageSizes);
  };

  function getCurBreakPoint() {
    return curBreakPoint;
  };

  function setCurBreakPoint(val) {
    curBreakPoint = val;
  };

  return {
    init: init,
    getBreakPoint: getBreakPoint,
    getCurBreakPoint: getCurBreakPoint,
    setCurBreakPoint: setCurBreakPoint
  };
});