(function() {
    // var app = angular.module('my-app', ['onsen.directives']);
    var app = ons.bootstrap();
    app.controller('AppController', function($scope) {
        //スイッチチェック
        $scope.beacon = true;

        $scope.changeSwitch = function() {
            $scope.beacon = !$scope.beacon;
            if ($scope.beacon) { //on

                var uuid = '00000000-0000-0000-0000-000000000000';
                var identifier = 'advertisedBeacon';
                var minor = 2000;
                var major = 5;
                var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
                console.log(beaconRegion);

                cordova.plugins.locationManager.requestWhenInUseAuthorization();

                // The Delegate is optional
                var delegate = new cordova.plugins.locationManager.Delegate();

                // Event when advertising starts (there may be a short delay after the request)
                // The property 'region' provides details of the broadcasting Beacon
                delegate.peripheralManagerDidStartAdvertising = function(pluginResult) {
                    console.log('peripheralManagerDidStartAdvertising: ' + JSON.stringify(pluginResult.region));
                };
                // Event when bluetooth transmission state changes
                // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
                delegate.peripheralManagerDidUpdateState = function(pluginResult) {
                    console.log('peripheralManagerDidUpdateState: ' + pluginResult.state);
                };

                cordova.plugins.locationManager.setDelegate(delegate);

                // Verify the platform supports transmitting as a beacon
                cordova.plugins.locationManager.isAdvertisingAvailable()
                    .then(function(isSupported) {
                        if (isSupported) {
                            console.log("Start advertising...");
                            cordova.plugins.locationManager.startAdvertising(beaconRegion)
                                .fail(conole.error)
                                .done();
                        } else {
                            console.log("Advertising not supported");
                        }
                    })
                    .fail(function(e) {
                        console.error(e);
                    })
                    .done();
            } else { //off
                // alert('unchecked');
                cordova.plugins.locationManager.stopAdvertising()
                    .fail(function(e) {
                        console.error(e);
                    })
                    .done();
                console.log($scope.beacon);
            }
        };

        //性別
        $scope.changeGender = function() {
          
        }
    });
})();
