const { CommandItem } = require('./command_item');

// const readl = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

class Store {
  constructor() {
    // the transaction stack will keep track of
    // all transactions
    this.transactionStack = []; 

    // hash table used to store values in.
    this.table = {};
  }

  // get number of value occurences with 'COUNT' command
  getNumOccurences(value) {
    let count = 0;
    // loop through table and count occurences manually
    Object.entries(this.table).forEach( entry => {
      let val = entry[1];
      if (val === value) {
        count += 1;
      }
    });

    return count;
  }

  // get value for key with 'GET' command
  getValue(key) {
    if (key in this.table) {
      const value = this.table[key];
      return value;
    } else {
      return null;
    }
  }

  // adds key value pair to the store using 'SET' command
  //TODO: add Command Item as argument
  // retrieve previous table if it exists add it to CommandItem
  // and push item to transaction stack.
  set(key, value) {
    this.table[key] = value;
  }
  
  // deletes key value pair from the table using 'DELETE'
  // command.
    //TODO: add Command Item as argument
    // retrieve previous table if it exists add it to CommandItem
    // and push item to transaction stack.
  delete(key) {
    if (key in this.table) {
      delete this.table[key];
    } else {
      console.log(`ERROR: ${key} could not be found in the table!!!`);
    }
  }

  // commits all items in the commandQueue to the table
  //while also storing the transaction history.
  //Process the commit queue and put items in the table.
  //when setting and deleting we must retrieve the previous value
  //if it exists before set or delete is executed!
  commit(queue) {
    // Process all items in the queue
    while(queue.length !== 0) {
      const item = queue.shift();
      switch(item.command) {
        case 'BEGIN':
          //push item to the stack to allow nested rollbacks.
          this.transactionStack.push(item);
          break;
        case 'SET':
          //first retrieve old value if it exists
          item.setPreviousTableValue(this.getValue(item.key));
          //push item to the transaction stack.
          this.transactionStack.push(item);
          //commit item to table by executing command.
          this.set(item.key, item.value);
          break;
        case 'DELETE':
          //first retrieve old value if it exists
          item.setPreviousTableValue(this.getValue(item.key));
          //push item to the transaction stack.
          this.transactionStack.push(item);
          //commit item to table by executing command.
          this.delete(item.key);
          break;
        
        default:
          console.log('improper command made it to the queue');
      }
    }
  }

  // rollsback to the last version of the table before the last
  // 'BEGIN' command.
  //TODO: handle previous values and stack with Command Item in mind.
  rollback(queue, readlineInterface) {
    if (this.transactionStack.length === 0) {
      console.log(`There is no history to rollback! \n` + 
        `If you continue, you are going to empty the transaction queue.\n`);
    }
    //BUG: question has unexpected behavior, but all other logic is good atm.
    //     readlineInterface.question(`Would you like to continue? (yes / no)`, (answer) => {
    //       switch(answer) {
    //         case 'yes':
    //           queue = [];
    //           break;
    //         case 'no':
    //           return;
  
    //         default:
    //           console.log('Please answer yes or no!');
    //       }
    //     });
    //   queue = [];
    //   return;
    // }

    // const rollbackPrompt = `You have selected ROLLBACK, once this transaction is executed\n` +
    //   `it will restore the table to the previous state before beginning\n` +
    //   `this transaction sequence.\n` +
    //   `Would you like to continue? (yes / no)`;
    // //console.log(rollbackPrompt);
    // readlineInterface.question(rollbackPrompt, (answer) => {
    //   switch(answer) {
    //     case 'yes':
    //       break;
    //     case 'no':
    //       return;
    //   }
    // });

    console.log('reached past questions');
    //Work through the transaction stack and restore values to 
    //previous BEGIN Command
    //TODO: check for begin command to allow for nested rollbacks
    while (this.transactionStack.length > 0) {
      const stackItem = this.transactionStack.pop();
      if(stackItem.getCommandType() === 'BEGIN') {
        console.log(`Rollback Complete`);
        return;
      } else if (stackItem.getCommandType() === 'SET') {
        // set previous table value for key
        const valueExisted = stackItem.getPreviousTableValue();
        if (valueExisted !== null) {
          this.set(stackItem.getKey(), valueExisted);
        } else {
          // if key didn't exist make sure it's deleted.
          this.delete(stackItem.getKey());
        }
      } else if (stackItem.getCommandType() === 'DELETE') {
        //restore previous value w set
        const valueExisted = stackItem.getPreviousTableValue();
        if(valueExisted !== null) {
          this.set(stackItem.getKey(), valueExisted);
        }
      } else {
        console.log(`rollback does not need to handle this command state...`);
        //continue;
      }
    }

    console.log(`Rollback Complete! Transaction History Empty!`);
  }

  // Removes transaction and previous value histories by
  // emptying both Store(this) objects stacks
  flushTransactionHistory() {
    this.transactionStack = [];
    this.previousTransactionValues = [];
  }

}

module.exports =  { Store };