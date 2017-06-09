var helper = require('./helper.js');
var BridgeLEDCommands = function(){};
var RgbwCommand = function(){};
var WhiteCommand = function(){};
var RgbFullColorCommand = function(){};
var RgbCommand = function(){};
var color = 0x7A;
var brightness = 0x32;

module.exports = {
  bridge: new BridgeLEDCommands(),
  rgbw: new RgbwCommand(),
  white: new WhiteCommand(),
  fullColor: new RgbFullColorCommand(),
  rgb: new RgbCommand()
};

BridgeLEDCommands.prototype.on = function() {
  return [0x31, 0x00, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.off = function() {
  return [0x31, 0x00, 0x00, 0x00, 0x03, 0x04, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.whiteMode = function() {
  return [0x31, 0x00, 0x00, 0x00, 0x03, 0x05, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.nightMode = function() {
  return [0x31, 0x00, 0x00, 0x00, 0x03, 0x06, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.off = function() {
  return [0x31, 0x00, 0x00, 0x00, 0x03, 0x04, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.brightness = function(b) {
  var bn = Math.min(Math.max(b, 0x00), 0x64);
  return [0x31, 0x00, 0x00, 0x00, 0x02, bn, 0x00, 0x00, 0x00, 0x01]
};

BridgeLEDCommands.prototype.hue = function(hue, enableLegacyColorWheel) {
  var cn = Math.min(Math.max(hue, 0x00), 0xFF);
  if (enableLegacyColorWheel) {
    cn = (0xFF - cn) - 0x52;
    if (cn < 0x00) {
      cn = 0xFF + cn
    }
  }
  return [0x31, 0x00, 0x00, 0x00, 0x01, cn, cn, cn, cn, 0x01]
};

BridgeLEDCommands.prototype.rgb = function(r, g, b) {
  return this.hue(helper.rgbToHue(r, g, b), true)
};

//
// RGBWW commands
//

RgbwCommand.prototype.on = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x01, 0x00, 0x00, 0x00, zn]
};

RgbwCommand.prototype.off = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x02, 0x00, 0x00, 0x00, zn]
};

RgbwCommand.prototype.whiteMode = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x05, 0x00, 0x00, 0x00, zn]
};

RgbwCommand.prototype.nightMode = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x06, 0x00, 0x00, 0x00, zn]
};

RgbwCommand.prototype.brightness = function(zone, percent){
  var bn = Math.min(Math.max(percent, 0x00), 0x64);
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x07, 0x02, bn, 0x00, 0x00, 0x00, zn]
};

/* Hue range 0-255 [targets last ON() activated bulb(s)] */
RgbwCommand.prototype.hue = function(zone, hue, enableLegacyColorWheel){
  var cn = Math.min(Math.max(hue, 0x00), 0xFF);
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  if (enableLegacyColorWheel) {
    cn = (0xFF - cn) - 0x37;
    if (cn < 0x00) {
      cn = 0xFF + cn
    }
  }
  return [0x31, 0x00, 0x00, 0x07, 0x01, cn, cn, cn, cn, zn]
};

RgbwCommand.prototype.rgb = function(zone, r, g, b) {
  return this.hue(zone, helper.rgbToHue(r, g, b), true)
};

// deprecated
RgbwCommand.prototype.rgb255 = function(zone, r, g, b) {
  return this.rgb(zone, r, g, b);
};

RgbwCommand.prototype.effectMode = function(zone, mode) {
  // values 0x01 to 0x09
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  var mn = Math.min(Math.max(mode, 0x01), 0x09);
  return [0x31, 0x00, 0x00, 0x07, 0x04, mn, 0x00, 0x00, 0x00, zn]
};

var modeNext=0x00;
RgbwCommand.prototype.effectModeNext = function(zone) {
  modeNext += 1;
  if (modeNext > 0x09) {
    modeNext = 0x01;
  }
  return [0x31, 0x00, 0x00, 0x07, 0x04, modeNext, 0x00, 0x00, 0x00, zone]
};

RgbwCommand.prototype.effectSpeedUp = function(zone){
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x03, 0x00, 0x00, 0x00, zone]
};

RgbwCommand.prototype.effectSpeedDown = function(zone){
  return [0x31, 0x00, 0x00, 0x07, 0x03, 0x04, 0x00, 0x00, 0x00, zone]
};

RgbwCommand.prototype.link = function(zone){
  return [0x3D, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

RgbwCommand.prototype.unlink = function(zone){
  return [0x3E, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

//
// WW/CW commands
//

WhiteCommand.prototype.on = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x07, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.off = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x08, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.brightUp = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.brightDown = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x02, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.maxBright = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x81, 0x07, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.nightMode = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x06, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.warmer = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x03, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.cooler = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x01, 0x01, 0x04, 0x00, 0x00, 0x00, zn]
};

WhiteCommand.prototype.link = function(zone){
  return [0x3D, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

WhiteCommand.prototype.unlink = function(zone){
  return [0x3E, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

//
// RGBWW/CW full color
//

RgbFullColorCommand.prototype.on = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x08, 0x04,0x01, 0x00, 0x00, 0x00, zn]
};

RgbFullColorCommand.prototype.off = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x08, 0x04, 0x02, 0x00, 0x00, 0x00, zn]
};

RgbFullColorCommand.prototype.whiteMode = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x08, 0x05, 0x64, 0x00, 0x00, 0x00, zn]
};

// temperature values 0x00 to 0x64 : examples: 00 = 2700K (Warm White), 19 = 3650K, 32 = 4600K, 4B, = 5550K, 64 = 6500K (Cool White)
RgbFullColorCommand.prototype.whiteTemperature = function(zone, temperature) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  var tn = Math.min(Math.max(temperature, 0x00), 0x64);
  return [0x31, 0x00, 0x00, 0x08, 0x05, tn, 0x00, 0x00, 0x00, zn]
};

RgbFullColorCommand.prototype.nightMode = function(zone) {
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x08, 0x04, 0x05, 0x00, 0x00, 0x00, zn]
};

RgbFullColorCommand.prototype.brightness = function(zone, percent){
  var bn = Math.min(Math.max(percent, 0x00), 0x64);
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  return [0x31, 0x00, 0x00, 0x08, 0x03, bn, 0x00, 0x00, 0x00, zn]
};

// if invertValue is not set, 0 is maximum saturation!
RgbFullColorCommand.prototype.saturation = function(zone, saturationValue, invertValue){
  var sn = Math.min(Math.max(saturationValue, 0x00), 0x64);
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  if (invertValue) {
    sn = 0x64 - sn;
  }
  return [0x31, 0x00, 0x00, 0x08, 0x02, sn, 0x00, 0x00, 0x00, zn]
};

/* Hue range 0-255 [targets last ON() activated bulb(s)] */
RgbFullColorCommand.prototype.hue = function(zone, hue, enableLegacyColorWheel){
  var cn = Math.min(Math.max(hue, 0x00), 0xFF);
  var zn = Math.min(Math.max(zone, 0x00), 0x04);
  if (enableLegacyColorWheel) {
    cn = (0xFF - cn) - 0x48;
    if (cn < 0x00) {
      cn = 0xFF + cn
    }
  }
  return [0x31, 0x00, 0x00, 0x08, 0x01, cn, cn, cn, cn, zn]
};

RgbFullColorCommand.prototype.rgb = function(zone, r, g, b) {
  var hsv=helper.rgbToHsv(r, g, b);
  return [
    this.hue(zone, helper.hsvToMilightColor(hsv), true),
    this.saturation(zone, hsv[1], true),
    this.brightness(zone, hsv[2])
  ]
};

RgbFullColorCommand.prototype.effectMode = function(zone, mode) {
  return [0x31, 0x00, 0x00, 0x08, 0x06, mode, 0x00, 0x00, 0x00, zone]
};

var fc_modeNext=0x00;
RgbFullColorCommand.prototype.effectModeNext = function(zone) {
  fc_modeNext += 1;
  if (fc_modeNext > 0x09) {
    fc_modeNext = 0x01;
  }
  return [0x31, 0x00, 0x00, 0x08, 0x06, fc_modeNext, 0x00, 0x00, 0x00, zone]
};

RgbFullColorCommand.prototype.effectSpeedUp = function(zone){
  return [0x31, 0x00, 0x00, 0x08, 0x04, 0x03, 0x00, 0x00, 0x00, zone]
};

RgbFullColorCommand.prototype.effectSpeedDown = function(zone){
  return [0x31, 0x00, 0x00, 0x08, 0x04, 0x04, 0x00, 0x00, 0x00, zone]
};

RgbFullColorCommand.prototype.link = function(zone){
  return [0x3D, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

RgbFullColorCommand.prototype.unlink = function(zone){
  return [0x3E, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

//
// RGB BULBS SINGLE CHANNEL/ZONE
//

RgbCommand.prototype.on = function(zone) {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x09, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.off = function(zone) {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x0a, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.brightUp = function() {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x01, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.brightDown = function() {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x02, 0x00, 0x00, 0x00, 0x01]
};

/* Hue range 0-255 [targets last ON() activated bulb(s)] */
RgbCommand.prototype.hue = function(hue, enableLegacyColorWheel){
  var cn = Math.min(Math.max(hue, 0x00), 0xFF);
  if (enableLegacyColorWheel) {
    cn = (0xFF - cn) - 0x37;
    if (cn < 0x00) {
      cn = 0xFF + cn
    }
  }
  return [0x31, 0x00, 0x00, 0x05, 0x01, cn, cn, cn, cn, 0x01]
};

RgbCommand.prototype.rgb = function(r, g, b) {
  return this.hue(helper.rgbToHue(r, g, b), true)
};

// deprecated
RgbCommand.prototype.rgb255 = function(r, g, b) {
  return this.rgb(r, g, b);
};

RgbCommand.prototype.effectModeUp = function() {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x05, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.effectModeDown = function() {
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x06, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.effectModeNext = function() {
  return this.effectModeUp()
};

RgbCommand.prototype.effectSpeedUp = function(){
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x03, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.effectSpeedDown = function(){
  return [0x31, 0x00, 0x00, 0x05, 0x02, 0x04, 0x00, 0x00, 0x00, 0x01]
};

RgbCommand.prototype.link = function(zone){
  return [0x3D, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};

RgbCommand.prototype.unlink = function(zone){
  return [0x3E, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, zone]
};