angular.module('ng-swagger-ui', [])


.filter('markdown', function() {

    var converter = new Showdown.converter();

    return function(markdown) {

        if (!markdown)
            return ;

        return converter.makeHtml(markdown) ;
    }
})



.factory("Formatter", function() {




	return {

		getEnumDescription : function(enumArray) {

			if (!enumArray)
				return "" ;

			var str = "" ;

			_.each(enumArray, function(e, index) {

				if (index == 0) {
					str = "" ;
				} else if (index < enumArray.length-1) {
					str = str + ", " ;
				} else {
					str = str + " or " ;
				}

				str = str + "<em>" + e + "</em>" ;
			}) ;

			return "(" + str + ")" ;
		}
	}

})








.controller('ModalApiObjectCtrl', function ($scope, $modalInstance, Formatter, object, models) {

	$scope.object = object ;
	$scope.models = models ;

	$scope.getEnumDescription = function(property) {
		return Formatter.getEnumDescription(property.enum) ;
	}
})



.directive('swaggerApis', function($http) {

	return {
		restrict: 'E',
		scope : {
			url: '@'
		},
		template:
			"<div ng-repeat='api in apis'>\n" +
			"	<hr/>\n" +
			"	<swagger-api api='api'/>\n" +
			"</div>",
		link: function(scope, element, attrs) {

			console.log(scope.url) ;

			scope.apis = [] ;

			$http.get(scope.url).success(function(data) {

				console.log(data) ;
				_.each(data.apis, function(api) {

					scope.apis.push(api) ;

					$http.get(scope.url + api.path).success(function(data) {
						api.details = data ;
					}) ;
				}) ;
			}) ;
		}
	}
})



.directive('swaggerApi', function() {

	return  {
		restrict: 'E',
		scope : {
			api: '='
		},
		templateUrl: "template/swagger-api.html",
		link: function (scope, element, attrs) {

		}
	}
}) 


.directive('swaggerOperation', function($filter) {

	return {
		restrict: 'E',
		scope : {
			resource: '=',
			operation: '=',
			api: '='
		},
		templateUrl: "template/swagger-operation.html",
		link: function (scope, element, attrs) {

			scope.getMethodClass = function(verb) {
				switch(verb) {
					case 'GET' : 
					return "label-success" ;
					case 'POST' : 
					return "label-primary" ;
					case 'DELETE' : 
					return "label-danger"
				}
			} ;

			scope.formatPath = function(path) {
				return path.replace(/\{([^}]*)\}/mg, "<span class='text-muted'>{$1}</span>");
			}

		}

	}


})



.directive('apiParameter', ['Formatter', function (Formatter) {

	return {
		restrict: 'E',
		scope: {
			param: '=',
			paramIndex: '=',
			models: '='
		},
		template: 
			"<div>\n" +
			"	<div class='text-right col-sm-2'>\n" +
			"		<span class='text-muted' ng-show='paramIndex == 0'> {{param.paramType}} parameters: </span>\n" +
			"	</div>\n" +
			"	<div class='col-sm-10'>\n" +
			"		<p>\n" +
			"			<span ng-show='{{param.required}}' tooltip='mandatory' tooltip-placement='left'><i class='fa fa-circle'></i></span> \n" +
			"			<span ng-hide='{{param.required}}' tooltip='optional' tooltip-placement='left'><i class='fa fa-circle-o'></i></span>\n" +
			"			&nbsp;\n" +
			"			<strong>{{param.name}}</strong> \n" +

			"			<api-object-badge property-type='param.type' models='models'></api-object-badge>\n" +

			"			&nbsp;\n" +

			"			<span>{{param.description}}</span>\n" +
			"			<span ng-bind-html='getEnumDescription(param)'></span>\n" +
			"		</p>\n" +
			"	</div>\n" +
			"</div>",

		link: function (scope, element, attrs) {

			scope.getEnumDescription = function(param) {

				return Formatter.getEnumDescription(param.enum) ;
			}
		}
	} 
}]) 





.directive('apiResponse', function ($sanitize) {

	return {
		restrict: 'E',
		scope: {
			response: '=',
			responseIndex: '=',
			models: '='
		},
		templateUrl: "template/api-response.html",
		link: function (scope, element, attrs) {

			scope.getResponseCodeClass = function(code) {

				if (code >= 200 && code < 300)
					return "label-success" ;
				else
					return "label-danger" ;
			}

		}
	} 
}) 


.directive('apiObjectBadge', function ($sanitize, $modal) {

	return {
		restrict: 'E',
		scope: {
			responseModel: '=',
			propertyType: '=',
			propertyRef: '=',
			models: '='
		},
		template:
			"<span>\n" +
			"	<a class='badge' ng-show='object' ng-click='showModal()'>{{fullObjectName}}</a>\n" +
			"	<span class='badge' ng-hide='object'>{{fullObjectName}}</span>\n" +
			"</span>",
		link: function (scope, element, attrs) {

			scope.$watch("responseModel", handleChange(), true) ;
			scope.$watch("propertyType", handleChange(), true) ;
			scope.$watch("propertyRef", handleChange(), true) ;

			function handleChange() {

				if (!scope.responseModel && !scope.propertyType && !scope.propertyRef)
					return ;

				if (scope.responseModel) {

					var genericsRegex = /(.+)[«](.+)[»]/g;

					var match = genericsRegex.exec(scope.responseModel) ;

					if(match) {
						scope.objectName = match[2] ;
						scope.fullObjectName = match[1] + "<" + match[2] + ">"
					} else {
						scope.objectName = scope.responseModel ;
						scope.fullObjectName = scope.responseModel ;
					}



				} else if (scope.propertyType) {

					scope.objectName = scope.propertyType ;
					scope.fullObjectName = scope.propertyType ;

				} else {
					scope.objectName = scope.propertyRef ;
					scope.fullObjectName = scope.propertyRef ;
				}

				if (scope.models)
					scope.object = scope.models[scope.objectName] ;
			}

			scope.showModal = function() {

				var modalInstance = $modal.open({
					template: 
					 	"<div class='modal-header'>\n" +
					   	"	<button type='button' class='close' ng-click='$dismiss()'><span aria-hidden='true'>&times;</span></button>\n" +
					   	"	<strong>{{object.id}}</strong>\n" +
					   	"</div>\n" +
				      	"<div class='modal-body'>\n" +
					    "  	<p>\n" +
					    "  		{{object.description}}\n" +
					    "  	</p>\n" +
					    "  	<p style='padding-left: 20px' ng-repeat='(propertyId, property) in object.properties'>\n" +
					    "  		<strong>{{propertyId}}</strong>\n" +
					    "  		<api-object-badge property-type='property.type' property-ref='property.$ref' models='models'></api-object-badge>\n" +
					    " 		<br/><span>{{property.description}}</span> \n" +
					    "  		<span ng-bind-html='getEnumDescription(property)''></span>\n" +
					    "  	</p>\n" +
				    	"</div>",
					controller: 'ModalApiObjectCtrl',
					resolve: {
						object: function () {
							return scope.object;
						},
						models: function () {
							return scope.models;
						}
					}
				});
			}
		}
	} 
}) ;






