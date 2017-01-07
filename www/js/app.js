(function() {

    // var app = angular.module('my-app', ['onsen.directives']);
    var app = ons.bootstrap();
    app.controller('AppController', function($scope) {
        $scope.beacon = {};

        $scope.changeSwitch = function() {
            var identifier = 'advertisedBeacon';
            var uuid,major,minor;

            if ($scope.beacon.on) {
              uuid = $scope.generateUUID();
              major = $scope.generateMajor();
              minor = $scope.generateMinor();

              startAdvertise(identifier,uuid,major,minor);
            } else {
              stopAdvertising();
            }
        };

        $scope.generateUUID = function() {
          return '00000000-0000-0000-0000-000000000000';
        };

        $scope.generateMajor = function() {
          //gender
          //2進数に変換
          var gender = Number($scope.beacon.gender).toString(2);
          //数字以外は0
          if(!gender){gender = 0;}
          //ゼロパディング
          gender = ("0"+gender).slice(-2);

          //age
          var age = Number($scope.beacon.age);
          //数字以外は0
          if(!age){age = 0;}
          age = Math.max(age, 0);
          age = Math.min(age,127);
          age = age.toString(2);
          //ゼロパディング
          age = ("000000"+age).slice(-7);


          var hobby_checks = [];
          var hobby_prefix = '0000000'
          angular.forEach($scope.beacon.hobbies, function(hobby) {
            if (hobby.checked) hobby_checks.push(hobby.id);
          });

          angular.forEach(hobby_checks, function(num, index) {
            if (num <= 7) { //7ケタまで
              hobby_prefix = hobby_prefix.substr(0, num-1) + '1' + hobby_prefix.substr(num-1 + 1);
            }
          });

          //off
          if (!$scope.beacon.genderOn) {
            gender = '00'
          }
          if (!$scope.beacon.ageOn) {
            age = '0000000'
          }
          if (!$scope.beacon.hobbiesOn) {
            hobby_prefix = '0000000'
          }

          var prefix = gender + age + hobby_prefix
          console.log('major',prefix);
          return parseInt(prefix,2);
        };

        $scope.generateMinor = function() {
          var hobby_checks = [];
          var hobby_prefix = '0000000000000000'
          angular.forEach($scope.beacon.hobbies, function(hobby) {
            if (hobby.checked) hobby_checks.push(hobby.id);
          });
          angular.forEach(hobby_checks, function(num, index) {
            if (num >= 8) { //8ケタ以上
              hobby_prefix = hobby_prefix.substr(0, num-1-7) + '1' + hobby_prefix.substr(num-1-7 + 1);
            }
          });

          //off
          if (!$scope.beacon.hobbiesOn) {
            hobby_prefix = '0000000000000000'
          }

          var prefix = hobby_prefix;

          console.log('minor',prefix);
          return parseInt(prefix,2);
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

    app.controller('ageController', function($scope) {
      //世代
      $scope.isGenerationAndBeaconOn = function() {

        if ($scope.beacon.on || !$scope.beacon.ageOn) {
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

function startAdvertise(identifier,uuid,major,minor) {

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
