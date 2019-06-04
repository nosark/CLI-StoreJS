
const { Store } = require('./src/store');
const { CommandItem } = require('./src/command_item');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal : false
});

const store = new Store();
console.log('Welcome to StoreJS, the library to meet all of your key value pair needs!');
console.log('StoreJS uses a CLI interface with the following format: \n <command> <key> <value> \n EX: SET abc 123\n');
console.log('Type QUIT at any time to end the program. :)');
console.log('Type --help for a list of commands. :) Happy Coding!');

// For restoring store state we only need to add Set and Delete Items to the
// Queue. We add BEGIN to the queue so we can easily push it to the transaction stack 
// and handle nested rollbacks.
// recursively prompt the user with commands until the QUIT
// command is entered.

const commitQueue = [];

const main = () => {
  rl.question('What would you like to do? ', (command) => {
    const com = command.trim().split(' ');
    let commandItem;
    if (com[0] === 'SET' || com[0] === 'DELETE') {
      commandItem = new CommandItem(com[0], com[1], com[2]);
    } else if (com[0] === 'BEGIN') {
      commandItem = new CommandItem(com[0], null, null);
    }
    
    switch(com[0]) {
      case 'SET':
        commitQueue.push(commandItem);
        break;
      case 'GET':
        const val = store.getValue(com[1]);
        console.log(`=> ${val}`);
        break;
      case 'DELETE':
        commitQueue.push(commandItem);
        break;
      case 'COMMIT':
        store.commit(commitQueue);
       break;
      case 'BEGIN':
        commitQueue.push(commandItem);
        break;
      case 'ROLLBACK':
        store.rollback(commitQueue, rl);
        break;
      case 'QUIT':
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




