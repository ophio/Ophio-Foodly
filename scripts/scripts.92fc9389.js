"use strict";var app=angular.module("ophioFoodly",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","ngStorage"]);app.config(["$routeProvider",function(a){a.when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",authenticationRequired:!0}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/category/:category",{templateUrl:"views/category.html",controller:"CategoryCtrl",authenticationRequired:!0}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"CategoryCtrl",authenticationRequired:!0}).otherwise({redirectTo:"/home"})}]),app.service("settings",function(){this.FIREBASE_URL="https://ophiofoodly.firebaseio.com/",this.AUTH_TOKEN_LENGTH=299,this.LOGIN_PROVIDER="google",this.CHECK_EMAIL_SUFFIX=!0,this.REQUIRED_EMAIL_SUFFIX="@ophio.co.in",this.isEmailAllowed=function(a){var b=this.REQUIRED_EMAIL_SUFFIX;return a.match(b+"$")[0]===b}}),app.service("loader",function(){this.loadingData=!0,this.getloadvalue=function(){return this.loadingData},this.setloadvalue=function(a){this.loadingData=a}}),app.service("AuthenticationService",["settings","$localStorage","$firebaseSimpleLogin","$location",function(a,b,c,d){this.isLoggedIn=function(){var a=this.getAuthToken();return Boolean(a)},this.getAuthToken=function(){if("undefined"!=typeof b.user){var a=b.user.firebaseAuthToken;if("undefined"!=typeof a)return a}return null},this.getCurrentUser=function(){return this.isLoggedIn?b.user:(alert("Your session has expired, Please login again."),void d.path("/login"))},this.tryLogin=function(){var e=c(new Firebase(a.FIREBASE_URL));e.$login(a.LOGIN_PROVIDER,{rememberMe:!0}).then(function(c){console.log(c),a.isEmailAllowed(c.email)?(b.user=c,d.path("/home")):(alert("Logging in with this email is not allowed"),d.path("/login"))},function(a){alert(a)})}}]),app.run(["$rootScope","$location","AuthenticationService",function(a,b,c){a.$on("$routeChangeStart",function(a,d){d.authenticationRequired&&!c.isLoggedIn()&&b.path("/login")})}]);var app=angular.module("ophioFoodly");app.controller("LoginCtrl",["$scope","settings","AuthenticationService",function(a,b,c){a.login=function(){return c.tryLogin()}}]);var app=angular.module("ophioFoodly");app.controller("HomeCtrl",["$scope","$location",function(a,b){a.show=function(a){b.path(a)}}]);var app=angular.module("ophioFoodly");app.controller("CategoryCtrl",["$scope","$timeout","loader","settings","AuthenticationService","$filter","$routeParams","$firebase",function(a,b,c,d,e,f,g,h){var i=new Firebase(d.FIREBASE_URL),j=i.child("availableItems"),k=i.child("votes"),l=function(){var a=f("date")(new Date,"yyyy-MM-dd"),b=h(k.child(a));return b};a.resultsDate={entries:[{time:1,count:100},{time:2,count:20},{time:3,count:43}]},a.temp={},a.temp.addingItem=!1,a.temp.newItemName="",a.temp.loadingData=c.getloadvalue(),a.temp.currentCategory=g.category,a.availableItems=h(j),a.todaysVotes=l(),a.categories=[{href:"healthy",title:"Healthy Bites"},{href:"snacks",title:"Snacks"},{href:"drinks",title:"Drinks"}];var m=function(){navigator.onLine?$(".connectionalert").modal("hide"):($(".connectionalert").modal({backdrop:"static",show:!0}),b(m,1e3))};navigator.onLine||b(m,1e3),a.currentUser=e.getCurrentUser(),a.availableItems.$on("loaded",function(){c.setloadvalue(!1),a.temp.loadingData=c.getloadvalue(),a.$apply()}),a.todaysVotes.$on("loaded",function(){a.$apply()}),a.getVoteCount=function(a){return _.keys(a).length-1},a.upVoteItem=function(b,c){{var d=new Date,e=d.getHours();d.getMinutes()}if(e>=10&&13>=e){var f=a.todaysVotes.$child(b);f.item_name=c.name,f.$save();var g=f.$child(a.currentUser.id);g.createdAt=new Date,g.username=a.currentUser.displayName,g.$save()}else $(".votealert").modal("toggle")},a.addNewItem=function(){var b={name:a.temp.itemName,category:a.temp.currentCategory,createdBy:a.currentUser.id};a.availableItems.$add(b),a.temp.itemName="",a.temp.addingItem=!1}}]);