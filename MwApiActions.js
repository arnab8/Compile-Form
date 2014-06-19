/**
 * Created by arnab_000 on 17-06-2014.
 */

var mwApiActions = angular.module('MwApiActions',['TransformModule']);

/**
 * This is the global user object when
 */
mwApiActions.factory('UserFactory',function(){

var userObj = { username:'',
                password:'',
                loginUserId:'',
                loginStatus:'',
                loginToken:'',
                editStatus:'',
                editToken:'',
                url:'http://dev.vanisource.org/w/api.php?'
              };

    return{
        /**
         * @param url this is just to initialise
         */
        init: function(url){
            userObj[url] = url;
        },
        /**
         * Interface methods to update the factory object userObj
         */
        getValue: function(keyName){
            return userObj[keyName];
        },
        setValue: function(keyName,keyValue){
          userObj[keyName] = keyValue;
        },
        addKey: function(keyName,keyValue){
          userObj[keyName] = keyValue;
        },
        deleteKey: function(keyName){
            delete userObj[keyName];
        },
        getUserObj: function(){
            return userObj;
        },
        /**
         *
         * @returns {Array} keys
         */
        getKeyList: function(){
            var keys = [];
            for(var k in userObj){
                keys.push(k);
            }
            return keys;
        }


    }


});

mwApiActions.factory('LoginFactory',['UserFactory','$http',function(UserFactory, $http){


function makeLoginTokenHTTPRequest(){

    return $http.post(UserFactory.getValue('url')+'action=login&format=json',{lgname:UserFactory.getValue('username'),lgpassword:UserFactory.getValue('password')});

}

function checkMyCredentialsHTTPRequest(){

    return $http.post(UserFactory.getValue('url')+'action=login&format=json', {lgname:UserFactory.getValue('username'),lgpassword:UserFactory.getValue('password'),lgtoken:UserFactory.getValue('loginToken')});
}


return{

    logMeIn : function(){

        var getLoginToken = function(){

                return makeLoginTokenHTTPRequest().then(function(data) {

                    UserFactory.setValue('loginToken',data.data.login.token)

                });

            },

         checkMyCreds = function(){

            return checkMyCredentialsHTTPRequest().then(function(data){

                UserFactory.setValue('loginStatus',data.data.login.result);
                UserFactory.setValue('loginUserId',data.data.login.result);

            });

        };

       return getLoginToken().then(checkMyCreds);

    }

}

}]);

mwApiActions.factory('EditFactory',['UserFactory','PageFactory','$http',function(UserFactory,PageFactory ,$http){


    function makeEditTokenHTTPRequest(){

    return $http.post(UserFactory.url+'action=query&prop=info|revisions&intoken=edit&titles='+encodeURIComponent(PageFactory.getValue('pageTitle'))+'&format=json',{});
    }

    function saveMyDataHTTPRequest(){

    return $http.post(UserFactory.url+'action=edit&format=json',{action:'edit',title:encodeURIComponent(PageFactory.getValue('pageTitle')),basetimestamp:(PageFactory.getValue('basetimestamp')),text:PageFactory.getValue('pageText'),token:(UserFactory.getValue('edittoken'))});
    }


    return{

        saveMyData: function(){

            var getEditToken = function(){

                    return makeEditTokenHTTPRequest().then(function(data){
                        console.log(data);
                        //There should be logic here to realise if this is a recompile request or a new page request
                        // incase of new page the object name is -1. So make this logic inside here.
                        UserFactory.pageId = Object.keys(data.data.query.pages)[0];

                        if(UserFactory.pageId === -1){
                            //This is a new page
                            UserFactory.editToken = data.data.query.pages[UserFactory.pageId].edittoken;
                            UserFactory.basetimestamp =  data.data.query.pages[UserFactory.pageId].starttimestamp;
                        }
                        else{
                            //existing page get the page title and page text as well
                        }


                    })

                },

            saveMyData = function(){

                    return saveMyDataHTTPRequest().then(function(data){
                      //Saved the data. Display the object
                        console.log(data);

                    })

            };

            getEditToken().then(saveMyData);

        }

    }


}]);

mwApiActions.factory('PageFactory',function(){

var pageObj = {

    pageId:'',
    pageTitle:'',
    pageText:'',
    basetimestamp:'',
    summary:''

};
    return{

        getValue: function(keyName){
            return pageObj[keyName];
        },
        setValue: function(keyName,keyValue){
            pageObj[keyName] = keyValue;
        }

    }


});