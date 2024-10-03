


import chalk from 'chalk'


const data = [
    { id: 12, name: 'erfan', age: 26 },
    { id: 13, name: 'alibi', age: 27 },
    { id: 14, name: 'myon', age: 31 }
  ];
  
//   const userId = 12;
  
//   // Use find to locate the object with the matching id
//   const user = data.find(user => user.id === userId);
  
//   if (user) {
//     console.log(user.name); // Output: 'erfan'
//   } else {
//     console.log('User not found');
  

// }



let userid=  parseInt(14)


const user_index =data.findIndex(user => user.id ===userid)
const user =data.find(user => user.id ===userid)




console.log(chalk.green('the real data =>'),data)
var a = data.splice(user_index,2)
// console.log(user_index)
// console.log(a)
console.log(chalk.blue('updated: =>',) ,data)