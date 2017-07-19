var mysql = require('mysql');

var FRIEND_TABLE = 'friend';
var TASK_TABLE = 'task';


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bobmemory',
  socketPath : '/tmp/mysql.sock'
});

function getFriends(){
  connection.query('select id, name from ' + FRIEND_TABLE ,
  function(err, results, fields) {
      if (err) throw err;
      else {
          console.log('Users which Hits me');
          console.log('----------------------------------');
          for (var i in results) {
              var friend = results[i];
              console.log(friend.id +': '+friend.name,friend.creationdate);
          }
      }
  });
}
function addFriend(id,name){
  connection.query('insert into '+ FRIEND_TABLE +' (id,name,creationdate) values ("' + id + '", "'
   + name + '", "' +   new Date().toISOString().substring(0,10) + '")',
  function selectCb(err, results, fields) {
      if (err) console.log(err.message);
      else console.log(results);;
  });
}
// export the module
module.exports = {
    getFriends: getFriends,
    addFriend: addFriend
};
