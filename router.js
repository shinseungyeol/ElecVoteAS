module.exports = function(app,random_bytes,connection){
    app.post('/login',function(req,res){
        var userID = req.body.userID;
        var userPassword = req.body.userPassword;
        var qry = 'SELECT* FROM USER WHERE userID = '+userID+'AND userPassword = '+userPassword;
        var resStatus = false;
        connection.query(qry,function(err,rows){  
            if(err){
                console.log('login post query error');
            }else{
                resStatus = true;
            }
            res.send({isSuccess:resStatus});
        });

    });

    app.post('/listOfVote',function(req,res){
        var qry = 'SELECT * FROM VOTE ORDER BY voteEdate ASC, voteSdate ASC';
        connection.query(qry,function(err,rows){
            var resStatus = false;
            var voteName
            if(err){
                console.log('listOfVote post query error');
            }else{
                resStatus = true;
            }
            res.send({isSuccess:resStatus,votes:rows});
        });

    })
    app.post('/doVote', function(req,res){
        var key = 'ballot';
        var userID = req.body.userID;
        var voteID = req.body.voteID;
        var candidateID = req.body.candidateID;
        var resStatus = false;
        var qry = "SELECT * FROM USER_VOTE_REL WHERE userID = ? AND voteID = ?";
        connection.query(qry,[userID,voteID],function(err,rows){
            if(rows.length==0){
                var qry = "INSERT INTO USER_VOTE_REL (userID,voteID) VALUES(?,?)";
                connection.query(qry,[userID,voteID],function(err,rows){
                    var qry = 'SELECT * FROM BALLOT'                     connection.query(qry,function(err,rows){                         var relLength = rows.length;                         var qry = 'INSERT INTO BALLOT (voteID,candidateID) VALUES (?,?)';                         connection.query(qry,[voteID,candidateID],function (err, result) {                             if(err){                                 console.log("vote post insert query error");                             }                             //블럭 체인에 보냄                             res.send({isSuccess:true});                          });
                    })
                });
            }
            else res.send({isSuccess:false});
        });
 
    });


    app.post('/infoVote', function (req, res) {
        var voteID = req.body.voteID;
        var qry = 'SELECT * FROM VOTE_CANDIATE_REL WHERE voteID = ?';
        var resArray = new Array();
        connection.qury(qry,voteID, function(err,rows){
            for(var i=0; i<voteID.length; i++){
                var qry = 'SELECT * FROM CANDIDATE WHERE candidateID = ?';
                connection.query(qury,rows[i].candidateID,function(err,rows){
                    var row = new Object();
                    row.candidateID = rows[0].candidateID;
                    row.candidateName = rows[0].candidateName;
                    row.candidateInfo = rows[0].candidateInfo;
                    row.img = Buffer.from(rows[0].img).toString('base64');
                    resArray.push(row);
                });
            }
        })
        res.send({isSuccess:false, data:resArray});
    });

}
