var app = angular.module('myApp', []);

app.controller('customersCtrl', function($scope, $http) {
    $scope.myVar = true;
    $scope.lines = [];
	
    $scope.search = function() {
        if ($scope.apiurl) {
            $scope.myVar = !$scope.myVar;
            $http.get($scope.apiurl)
                .success(function(response) {
                    $scope.action = response.entities;
                    $scope.myVar = !$scope.myVar;
                });
        } else {
            alert("Enter a valid URL");
        }
    };

    $scope.checkAll = function(entities) {
        $scope.fulldatalist = [];
        $scope.lines = [];
        var checkbx_ = document.getElementById("selectedAll").checked;
        angular.forEach(entities, function(entity) {
            document.getElementById(entity.uuid).checked = checkbx_;
            $scope.selecteddata(entity);
        });
    };

    $scope.adddata = function(newdata) {
        if (typeof newdata.mockData === 'object') {
            if ($scope.apiurl) {
                if (newdata.id && newdata.dataType) {
                    $scope.myVar = !$scope.myVar;
                    var trgtURL = $scope.apiurl;
                    if (trgtURL.search("\\?") > -1) {
                        trgtURL = trgtURL.split("?")[0];
                    }
                    $http.get($scope.apiurl)
                        .success(function(response) {
                            $scope.action = response.entities;
                        });
                    trgtURL = trgtURL + "?ql=select uuid where id='" + newdata.id + "' and dataType='" + newdata.dataType + "'";
                    $http.get(trgtURL)
                        .success(function(response) {
                            if (response.count == 0) {
								var str = $scope.apiurl;
								if (str.search("\\?") > -1) {
									str = str.split("?")[0];
								}
								function makeUrl(){
									return $scope.httpUrl = str + "?access_token=" + $scope.apitoken;
								}
								str= makeUrl();
								if($scope.apitoken!== null && $scope.apitoken !== undefined)
								{
									var res = $http.post(str, newdata)
										.success(function(data, status) {
											$scope.showDetails = !$scope.showDetails;
											$scope.search();
											$scope.myVar = !$scope.myVar;
										})
										.error(function(data, status){
											if(status=="401")
											{
												alert("Access Token is Unauthorized");
											}
										});
								}
								else
								{
									alert("Please Enter a Valid Token");
								}
                            } else {
                                alert("You are trying to add a duplicate data!!!");
                                $scope.myVar = !$scope.myVar;
                            }
                        });
                } else {
                    alert("Please enter valid Id and dataType");
                }
            } else {
                alert("Enter a valid URL");
            }
        } else {
            alert("Please add a valid mockData");
        }
    };

    $scope.update = function(entity) {
        var str = $scope.apiurl;
        if (str.search("\\?") > -1) {
            str = str.split("?")[0];
        }
		function makeUrl(){
			return $scope.httpUrl = str + "?access_token=" + $scope.apitoken;
		}
		function makeUrl2(){
			return $scope.httpUrl = str + "/" + entity.uuid + "/?access_token=" + $scope.apitoken;
		}
		var strPost = makeUrl();
		var str = makeUrl2();
        $scope.myVar = !$scope.myVar;
		if($scope.apitoken!== null && $scope.apitoken !== undefined)
		{
			var res = $http.post(strPost, entity)
				.success(function(data, status) {
					
					var request = $http.delete(str)
						.success(function(data, status) {
							$scope.search();
							$scope.myVar = !$scope.myVar;
							$scope.fulldatalist = [];
							document.getElementById("selectedAll").checked = false;
						});
						
				})
				.error(function(data, status){
					if(status=="401")
						{
							alert("Access Token is Unauthorized");
						}
				});
		}
		else
		{
			alert("Please Enter a Valid Token");
		}
    };

    $scope.delete = function(del) {
        var str = $scope.apiurl;
        if (str.search("\\?") > -1) {
            str = str.split("?")[0];
        }
		function makeUrl2(){
			return $scope.httpUrl = str + "/" + del + "/?access_token=" + $scope.apitoken;
		}
		str= makeUrl2();
		$scope.myVar = !$scope.myVar;
		if($scope.apitoken!== null && $scope.apitoken !== undefined)
		{
        var request = $http.delete(str)
            .success(function(data, status) {
                $scope.search();
                $scope.myVar = !$scope.myVar;
                $scope.fulldatalist = [];
                document.getElementById("selectedAll").checked = false;
            })
			.error(function(data, status){
				if(status=="401")
					{
						alert("Access Token is Unauthorized");
					}
			});
		}
		else
		{
			alert("Please Enter a Valid Token");
		}
    };

    $scope.prompt = function(uuid) {
        prompt("Please copy the UUID from here", uuid);
    };

    $scope.selecteddata = function(entity) {
        var checkbx = document.getElementById(entity.uuid).checked;
        if (checkbx) {

            if ($scope.lines.indexOf(entity) > -1)
                $scope.lines.splice($scope.lines.indexOf(entity), 1);

            $scope.lines.push(entity);
            $scope.fulldatalist = $scope.lines;
        } else {

            $scope.lines.splice($scope.lines.indexOf(entity), 1);
            $scope.fulldatalist = $scope.lines;
        }
    }

    $scope.updateall = function() {
        $scope.entities = $scope.fulldatalist;
        var str = $scope.apiurl;
        if (str.search("\\?") > -1) {
            str = str.split("?")[0];
        }
		function makeUrl(){
			return $scope.httpUrl = str + "?access_token=" + $scope.apitoken;
		}
		function makeUrl2(){
			return $scope.httpUrl = str + "/" + entity.uuid + "/?access_token=" + $scope.apitoken;
		}
		var strPost = makeUrl();
		var str = makeUrl2();
        angular.forEach($scope.entities, function(entity) {
		if($scope.apitoken!== null && $scope.apitoken !== undefined)
		{
            var request = $http.delete(str)
                .success(function(data, status) {
                    document.getElementById("current").innerHTML = entity.uuid;
					var res = $http.post(strPost, entity)
                        .success(function(data, status) {
                            document.getElementById("current").innerHTML = entity.uuid;
                            $http.get($scope.apiurl)
                                .success(function(response) {
                                    $scope.action = response.entities;
                                    document.getElementById("current").innerHTML = "";
                                });
                        });
					
                })
				.error(function(data, status){
					if(status=="401")
						{
							alert("Access Token is Unauthorized");
						}
				});
		}
		else
		{
			alert("Please Enter a Valid Token");
		}
        });
        $scope.fulldatalist = [];
        document.getElementById("selectedAll").checked = false;
    }

    $scope.deleteall = function() {
        $scope.entities = $scope.fulldatalist;
        $scope.myVar = !$scope.myVar;

        var str = $scope.apiurl;
        if (str.search("\\?") > -1) {
            str = str.split("?")[0];
        }
		function makeUrl2(){
			return $scope.httpUrl = str + "/" + entity.uuid + "/?access_token=" + $scope.apitoken;
		}
		str= makeUrl2();
        angular.forEach($scope.entities, function(entity) {
			if($scope.apitoken!== null && $scope.apitoken !== undefined)
			{
				var request = $http.delete(str)
					.success(function(data, status) {
						document.getElementById("current").innerHTML = entity.uuid;
						$http.get($scope.apiurl)
							.success(function(response) {
								$scope.action = response.entities;
								document.getElementById("current").innerHTML = "";
							});
					})
					.error(function(data, status){
						if(status=="401")
							{
								alert("Access Token is Unauthorized");
							}
					});
			}
			else
			{
				alert("Please Enter a Valid Token");
			}
        });
        $scope.myVar = !$scope.myVar;
        $scope.fulldatalist = [];
        document.getElementById("selectedAll").checked = false;
    }
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('jsonText', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {

            var lastValid;

            ngModelCtrl.$parsers.push(fromUser);
            ngModelCtrl.$formatters.push(toUser);

            element.bind('blur', function() {
                element.val(toUser(scope.$eval(attrs.ngModel)));
            });

            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                lastValid = lastValid || newValue;

                if (newValue != oldValue) {
                    ngModelCtrl.$setViewValue(toUser(newValue));

                    ngModelCtrl.$render();
                }
            }, true);

            function fromUser(text) {
                if (!text || text.trim() === '') {
                    return {};
                } else {
                    try {
                        lastValid = angular.fromJson(text);
                        ngModelCtrl.$setValidity('invalidJson', true);
                    } catch (e) {
                        ngModelCtrl.$setValidity('invalidJson', false);
                    }
                    return lastValid;
                }
            }

            function toUser(object) {
                return angular.toJson(object, true);
            }
        }
    };
});