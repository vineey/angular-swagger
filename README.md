## Modification
This fork is intended to make the swagger template customizable by externalizing the directive templates from the main
js file.

##angular-swagger

This module provides a simple, minimal interface for reading [Swagger](https://helloreverb.com/developers/swagger) documentation. 

The interface is built using ordinary [Bootstrap](http://getbootstrap.com) components, so you should find it very easy to theme and style.


## Dependencies

This requires [AngularJS](https://angularjs.org/). In addition, you will need:

 * [Bootstrap](http://getbootstrap.com)
 * [Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/)
 * [Showdown](https://github.com/showdownjs/showdown)


## Installation

1. Install with bower using `bower install ng-swagger-ui`

2. Include `ng-swagger-ui.js`, which should be located in `bower_components/ng-swagger-ui`

3. Include `bootstrap.min.css` (which should be in `bower_components/bootstrap/dist/css`) 

4. Include `ui-bootstrap-tpls.min.js` (in `bower_components/angular-bootstrap`)

5. Include `showdown.js` (in `bower_components/showdown/compressed`)

6. Add `angular-swagger` as a module dependency to your app.


## Usage

Simply create the following element

    <swagger-apis url='path/to/swagger' />

where `path/to/swagger` is the location of your swagger documentation (usually `/api-docs/`)

