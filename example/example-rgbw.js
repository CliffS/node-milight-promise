var Milight = require('../src/index').MilightController;
var commands = require('../src/index').commands;

// Important Notes:
//*   Instead of providing the global broadcast address which is the default, you should provide the IP address
//    of the Milight Controller for unicast mode. Don't use the global broadcast address on Windows as this may give
//    unexpected results. On Windows, global broadcast packets will only be routed via the first network adapter. If
//    you want to use a broadcast address though, use a network-specific address, e.g. for `192.168.0.1/24` use
//    `192.168.0.255`.

var light = new Milight({
        ip: "192.168.178.255",
        delayBetweenCommands: 50,
        commandRepeat: 2
    }),
    zone = 1;

light.sendCommands(commands.rgbw.on(zone), commands.rgbw.brightness(100), commands.rgbw.whiteMode(zone));
light.pause(1000);

light.sendCommands(commands.rgbw.off(zone));
light.pause(1000);

// Setting Hue
light.sendCommands(commands.rgbw.on(zone));
for (var x = 0; x < 256; x += 5) {
    light.sendCommands(commands.rgbw.hue(x));
    light.pause(100);
}
light.pause(1000);

light.sendCommands(commands.rgbw.off(zone));
light.pause(1000);

// Back to white mode
light.sendCommands(commands.rgbw.on(zone), commands.rgbw.whiteMode(zone));
light.pause(1000);

// Setting Hue
light.sendCommands(commands.rgbw.on(zone));
for (var x = 100; x >= 0; x -= 5) {
    light.sendCommands(commands.rgbw.brightness(x));
    light.pause(100);
}
light.pause(1000);

light.sendCommands(commands.rgbw.off(zone));
light.pause(1000);

light.close().then(function () {
    console.log("Finished");
});

