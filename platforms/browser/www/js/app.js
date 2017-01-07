(function() {

    // var app = angular.module('my-app', ['onsen.directives']);
    var app = ons.bootstrap();
    app.controller('AppController', function($scope) {
        $scope.beacon = {};

        $scope.changeSwitch = function() {
            console.log($scope.beacon.gender);
            if ($scope.beacon.on) {
              startAdvertise();
            } else {
              stopAdvertising();
            }
        };

    });


    app.controller('genderController', function($scope) {
      //性別
      $scope.isGenderAndBeaconOn = function() {

        if ($scope.beacon.on || !$scope.beacon.genderOn) {
          return true;
        }else{
          return false;
        }
      }

    });

    app.controller('generationController', function($scope) {
      //世代
      $scope.isGenerationAndBeaconOn = function() {

        if ($scope.beacon.on || !$scope.beacon.generationOn) {
          return true;
        }else{
          return false;
        }
      }

    });

    app.controller('hobbyController', function($scope) {
      $scope.beacon.hobbies = [
        {id: 1, name: 'パソコン・インターネット'},
        {id: 2, name: '旅行観光'},
        {id: 3, name: '盆栽・ガーデニング・家庭菜園など'},
        {id: 4, name: '映画鑑賞・DVD鑑賞'},
        {id: 5, name: '旅行観光'},
        {id: 6, name: 'ジョギング・ウォーキング'},
        {id: 7, name: '写真撮影・映像撮影'},
        {id: 8, name: '宝くじ・懸賞など'},
        {id: 9, name: 'ドライブ'},
        {id: 10, name: 'ゲーム'},
        {id: 11, name: 'スポーツ観戦'},
        {id: 12, name: '釣り'},
        {id: 13, name: '編み物・手芸など'},
        {id: 14, name: '登山トレッキングなど'},
        {id: 15, name: '料理'},
        {id: 16, name: '楽器演奏・バンドなど'},
        {id: 17, name: '資格取得の学習'},
        {id: 18, name: '絵画・陶芸・工芸など'},
        {id: 19, name: '囲碁・将棋・麻雀など'},
        {id: 20, name: 'カラオケ'},
        {id: 21, name: 'その他'},
      ];
      console.log($scope.beacon.hobbies);
      $scope.check = function() {
        var checks = [];
        angular.forEach($scope.beacon.hobbies, function(hobby) {
          if (hobby.checked) checks.push(hobby.id);
        });
        console.log(checks);
      };


      $scope.isHobbiesAndBeaconOn = function() {

        if ($scope.beacon.on || !$scope.beacon.hobbiesOn) {
          return true;
        }else{
          return false;
        }
      }


    });

})();

function startAdvertise() {
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
}

function stopAdvertising() {
  cordova.plugins.locationManager.stopAdvertising()
      .fail(function(e) {
          console.error(e);
      })
      .done();
}
