<?php
class final_rest
{



/**
 * @api  /api/v1/setTemp/
 * @apiName setTemp
 * @apiDescription Add remote temperature measurement
 *
 * @apiParam {string} location
 * @apiParam {String} sensor
 * @apiParam {double} value
 *
 * @apiSuccess {Integer} status
 * @apiSuccess {string} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":0,
 *              "message": ""
 *     }
 *
 * @apiError Invalid data types
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":1,
 *              "message":"Error Message"
 *     }
 *
 */
        public static function setTemp ($location, $sensor, $value)

        {
                if (!is_numeric($value)) {
                        $retData["status"]=1;
                        $retData["message"]="'$value' is not numeric";
                }
                else {
                        try {
                                EXEC_SQL("insert into temperature (location, sensor, value, date) values (?,?,?,CURRENT_TIMESTAMP)",$location, $sensor, $value);
                                $retData["status"]=0;
                                $retData["message"]="insert of '$value' for location: '$location' and sensor '$sensor' accepted";
                        }
                        catch  (Exception $e) {
                                $retData["status"]=1;
                                $retData["message"]=$e->getMessage();
                        }
                }

                return json_encode ($retData);
        }


        // This is the sign up function that allows someone to create an account.
        public static function signUp ($name, $username, $password)

        {
                        try {
                                $EXIST=GET_SQL("select * from auth where username=?", $username);
                                if (count($EXIST) > 0) {
                                        $retData["status"]=1;
                                        $retData["message"]="User $username exists";
                                }
                                else {
                                        EXEC_SQL("insert into auth (name,username,password) values (?,?,?)",$name,$username,password_hash($password, PASSWORD_DEFAULT));
                                        $retData["status"]=0;
                                        $retData["message"]= "User $username Inserted";
                                }
                        }
                        catch  (Exception $e) {
                                $retData["status"]=1;
                                $retData["message"]=$e->getMessage();
                        }


                return json_encode ($retData);
}

// This is the login function that allows someone to login to their account.
public static function login ($username, $password)

        {
                        try {
                                $USER=GET_SQL("select * from auth where username=?", $username);
                                // GET_SQL returns a list of returned records
                                // Each array element is an array of selected fields with column names as key
                                if (count($USER) ==  1) {
                                        if(password_verify($password, $USER[0]["password"])) {
                                                $id = session_create_id();
                                                EXEC_SQL("update auth set session=?, experation= DATETIME(CURRENT_TIMESTAMP,'+30 minutes') where username=?",
                                                        $id,$username);
                                                $retData["status"]=0;
                                                $retData["session"]=$id;
                                                $retData["message"]= "User '$username' logged in";
                                        } else {
                                                $retData["status"]=1;
                                                $retData["message"]= "User/Password Not Found 1";
                                        }
                                } else {
                                                $retData["status"]=1;
                                                $retData["message"]= "User/Password Not Found 2";
                                        }

                        } // try end curly
                        catch  (Exception $e) {
                                $retData["status"]=1;
                                $retData["message"]=$e->getMessage();
                        }


                return json_encode ($retData);
        }


// This is the logout function.
public static function logout ($username, $session)

        {
                        try {
                                $USER=GET_SQL("select * from auth where username=? and session=?", $username, $session);
                                // GET_SQL returns a list of returned records
                                // Each array element is an array of selected fields with column names as key
                                if (count($USER) ==  1) {
                                        EXEC_SQL("update auth set session=null, experation=null where username=?", $username);
                                        $retData["status"]=0;
                                        $retData["message"]="User '$username' logged out";
                                        } else {
                                        $retData["status"]=1;
                                        $retData["message"]= "User not found";
                                        }

                        } // try end curly
                        catch  (Exception $e) {
                                $retData["status"]=1;
                                $retData["message"]=$e->getMessage();
                        }


                return json_encode ($retData);
        }


public static function addToFavorites ($username, $session, $ticker, $time, $name)

        {
                $USER = GET_SQL("select * from auth where username=? and session=?", $username, $session);
                $TICKER = GET_SQL("select * from favorites where username=? and ticker=?", $username, $ticker);
                $TOTAL = GET_SQL("select * from favorites where username=?", $username);
                if (count($USER) == 1 && count($TICKER) < 1 && count($TOTAL) < 5) {
                        EXEC_SQL("insert into favorites (username,session,ticker,time, name) values (?,?,?,?,?)", $username, $session, $ticker, $time, $name);
                        $retData["status"]=0;
                        $retData["message"]="Stock '$ticker' added to favorites";
                } else {
                        $retData["status"]=1;
                        $retData["message"]= "Could not find user/Ticker already in favorites/Exceded limit";
                }

                return json_encode ($retData);
}

public static function getFavorites ($username)

        {
                $TICKER = GET_SQL("select * from favorites where username=?", $username);

                if (count($TICKER) >= 1) {
                        $retData["status"]=0;
                        $retData["results"]=$TICKER;
                } else {
                        $retData["status"]=1;
                        $retData["message"]="Didnt work";
                }

                return json_encode ($retData);
        }


}

