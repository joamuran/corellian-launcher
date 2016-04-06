var dbus = require('dbus-native');
var bus = dbus.systemBus();
    
function DisksManager(){
    this.udservice = bus.getService('org.freedesktop.UDisks');
    this.deviceList=null;
}

DisksManager.prototype.getDevices=function getDevices(parentCallback) { // podem afegir altre fallback per a quan s'afiden discos i se lleven!!
    var self=this;
    
    self.udservice.getInterface(
    '/org/freedesktop/UDisks',
    'org.freedesktop.UDisks', 
    function(err, ud) {
        ud.on('DeviceAdded', function(deviceObjectPath) {
            self.enumDevices(ud, parentCallback);
            /*
                console.log('DeviceAdded', deviceObjectPath);
                self.udservice.getInterface(deviceObjectPath, 'org.freedesktop.DBus.Properties', function(err, diskProperties) {
                        diskProperties.Get('/org/freedesktop/UDisks/Device', 'DeviceMountPaths', function(err, mountPointPaths) {
                            //console.log(JSON.stringify(mountPointPaths, null, 2));
                            
                            self.getDiskInfo(diskProperties, ['DeviceFile','DeviceMountPaths', 'DeviceIsRemovable','PartitionType',
                                                      'DeviceIsPartition', 'DeviceIsMounted', 'IdUuid', 'IdLabel', 'IdUsage',
                                                      'DeviceIsDrive', 'DeviceIsOpticalDisc', 'DeviceSize', 'IdType'], {},
                                   function(pl){
                                        // arrayDevices.push(pl); // -> Serà global, i caldrà vore com llevar-lo
                                        console.log(JSON.stringify(pl, null, 2));
                                    });
                             
                        });
                    });*/

        });
        ud.on('DeviceRemoved', function(deviceObjectPath) {
                //console.log('DeviceRemoved', deviceObjectPath);
                self.enumDevices(ud, parentCallback);
        });
        

        
        self.enumDevices(ud, parentCallback);
        var timer=setInterval(function(){
            self.enumDevices(ud, parentCallback);
            }
        , 1000);
        
        
        }
    );
    
}


DisksManager.prototype.enumDevices=function enumDevices(ud,parentCallback) {
    var self=this;
    
        ud.EnumerateDevices( function (a, b, c){
                            
            arrayDevices=[];
            for (index in b) {
                var item={};
                self.udservice.getInterface(b[index], 'org.freedesktop.DBus.Properties', function(err, diskProperties) {
                    
                    self.getDiskInfo(diskProperties, ['DeviceFile','DeviceMountPaths', 'DeviceIsRemovable','PartitionType',
                                                      'DeviceIsPartition', 'DeviceIsMounted', 'IdUuid', 'IdLabel', 'IdUsage',
                                                      'DeviceIsDrive', 'DeviceIsOpticalDisc', 'DeviceSize', 'IdType'], {},
                                   function(pl){
                                        arrayDevices.push(pl);
                                        self.printDevices(b.length, arrayDevices,parentCallback);
                                    });
                    
                }); // getInterface
                
            } // FOR
            

            });        
    
    
}


DisksManager.prototype.getDiskInfo=function getDiskInfo(diskProperties, items, parameter_list, callback) {
        var self=this;
        
        var _item=items[items.length-1];
        
        if (typeof(_item)==="undefined") callback(parameter_list); 
        else{
            // Getting properties
            diskProperties.Get("org.freedesktop.UDisks.Device",_item, function(err, info) {
                    // Item will be the index (the parameter from disk)
                    var item=items.pop();
                    // Adding this pair to parameter_list
                    parameter_list[item]=info[1][0];
                    // Recursive call
                    self.getDiskInfo(diskProperties, items, parameter_list, callback); 
                });
            
        } // else
}
    
DisksManager.prototype.printDevices=function printDevices(num, array, parentCallback){
    var self=this;
    if (array.length<num) return;
    self.deviceList=array;
    parentCallback(self.deviceList);
    
}

DisksManager.prototype.mountDevice=function mountDevice(uuid){
    var self=this;
    console.log(uuid);
}



//var dm=new DisksManager();
//dm.mountDevice("168e1ac3-4edf-4a4b-9f24-38101db3da11");

/*dm.getDevices(function(dl){
    console.log(dl);});*/

// Mirar tambe: https://wiki.archlinux.org/index.php/udisks#Mount_to_.2Fmedia_.28udisks2.29

/*for dev in ud_manager.EnumerateDevices():
    device_obj = bus.get_object("org.freedesktop.UDisks", dev)
    device_props = dbus.Interface(device_obj, dbus.PROPERTIES_IFACE)
    print str(i)+"******************************************************************"
    print device_props.Get('org.freedesktop.UDisks.Device', "DriveVendor")
    print device_props.Get('org.freedesktop.UDisks.Device', "DeviceMountPaths")
    print device_props.Get('org.freedesktop.UDisks.Device', "DriveSerial")
    print device_props.Get('org.freedesktop.UDisks.Device', "PartitionSize")
    i=i+1*/