# SBC
To run type "node back_end/app.js" in the cloned folder
API's --------------------------------------------------------------------------------------------------------

To push notifications u need to login as admin:

Api for registration :

    "HostIP:1234/user/register" with parameters {"name" : String ,
                                                "email" : String,
                                                "password" : String}
    This should be a post request with parameters as JSON .Will get a json web token in return.Use it for
    authentication.

Api for login :

    "HostIP:1234/user/login" with query parameters {"email":String,
    "password":String}
    Should be a get request.Will get a json web token in return.Use it for
    authentication.

Api for pushing notification to the server :

    This is admin authenticated. First copy the token from login or register and create a header in the request,
    called 'x-access-token' and put the token in it.
    "HostIP:1234/api/pushNotification" with parameters {"clubName" : String,
    "heading" : String,
    "content" : String }
    This should be a post request with parameters as JSON.

Api for geting notification from the server :

    "HostIP:1234/getNotification"
    Will return an array of JSON. (It does return a hash of the password of the admin ,so...)
