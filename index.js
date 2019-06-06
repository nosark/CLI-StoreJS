
const { Store } = require('./src/store');
const { CommandItem } = require('./src/command_item');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal : false
});

const store = new Store();
console.log(`\n\nWelcome to StoreJS, the library to meet all of your key value pair needs!`);
console.log(`StoreJS uses a CLI interface. type --help for a list of available commands. Happy Coding! :)`);
console.log(`Type QUIT at any time to end the program. :)`);

// For restoring store state we only need to add Set and Delete Items to the
// Queue. We add BEGIN to the queue so we can easily push it to the transaction stack 
// and handle nested rollbacks.
// recursively prompt the user with commands until the QUIT
// command is entered.

const commitQueue = [];

const main = () => {
  rl.question('What would you like to do? ', (command) => {
    const com = command.trim().split(' ');

    // handles incorrect command and multiline args
    if (com.length > 3) {
      console.log(`ERROR: all commands take 3 arguments or less... Please try again`);
      return main();
    }
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
        console.log(`quitting StoreJS process`);
        process.exit(0);
        break;
      case 'COUNT':
        const count = store.getNumOccurences(com[1]);
        console.log(`${count}`);
        break;
      case '--help':
        store.logHelp();
        break;

      default: 
        console.log(`Something went wrong / Incorrect Command!`);
    }
    
    main();
  });
};

main();




