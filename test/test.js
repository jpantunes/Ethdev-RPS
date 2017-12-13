// var RockPaperScissor = artifacts.require("./RockPaperScissor.sol");
//
// contract('RockPaperScissor', function(accounts) {
//
//   it("test", function() {
//
//     let instance = null;
//
//     return RockPaperScissor.deployed().then((i) => {
//       console.log('instancec');
//       instance = i;
//       return instance.addCharity('test', accounts[3], {from : accounts[0]}).then((a) =>{
//         console.log(a);
//       })
//     }).then(() => {
//       return instance.addCharity('test', accounts[3], {from : accounts[0]}).then((a) =>{
//         console.log(a);
//       })
//     }).then(() => {
//       console.log('CharitiesResolver');
//       let transferEvent = instance.LogNewCharity({}, {fromBlock: 0, toBlock: 'latest'})
//       transferEvent.get((error, logs) => {
//         // we have the logs, now print them
//         console.log('ok2');
//         logs.forEach(log => console.log(log.args))
//       })
//     })
//   });
// });
