
const { Store } = require('./src/store');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const store = new Store();
console.log('Welcome to StoreJS, the library to meet all of your key value pair needs!');
console.log('StoreJS uses a CLI interface with the following format: \n <command> <key> <value> \n EX: SET abc 123\n');
console.log('Type QUIT at any time to end the program. :)');

//TODO: Check to see if you could restore states using Begin commands and 
// have a deep rollback system that can handle multiple successive rollback 
// commands.

// const commitQueue = [];
// recursively prompt the user with commands until the QUIT
// command is entered.
const main = () => {
  rl.question('What would you like to do? ', (command) => {
    const com = command.trim().split(' ');
   
    switch(com[0]) {
      case "SET":
        store.set(com[1], com[2]);
        break;
      case 'GET':
        store.getValue(com[1]);
        break;
      case 'DELETE':
        store.delete(com[1]);
        break;
      case 'COMMIT':
       //TODO: store.commit();
       break;
      case 'BEGIN':
        store.flushTransactionHistory();
        //then make sure you're building the stacks 
        // as commands come out.
        //TODO: store.begin();
      break;
      case 'ROLLBACK':
      //TODO: store.rollback();
      break;
      case "QUIT":
        console.log('quit');
        process.exit(0);
        break;
      case 'COUNT':
        const count = store.getNumOccurences(com[1]);
        console.log(`${count}`);
        break;

      default: 
        console.log('Something went wrong / Incorrect Command!');
    }

    main();
  });
};

main();




