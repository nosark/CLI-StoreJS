
// Store is a Key:Value Store with the ability to rollback it's state
// using a transaction stack as a history keeper.
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
  set(key, value) {
    this.table[key] = value;
  }
  
  // deletes key value pair from the table using 'DELETE'
  // command.
  delete(key) {
    if (key in this.table) {
      delete this.table[key];
    } else {
      console.log(`ERROR: ${key} could not be found in the table!!!`);
    }
  }

  // commits all items in the commandQueue to the table
  //while also storing the transaction history.
  //Process the commit queue and puts items in the table.
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
          item.setPreviousTableValue(this.getValue(item.key));
          this.transactionStack.push(item);
          this.set(item.key, item.value);
          break;
        case 'DELETE':
          item.setPreviousTableValue(this.getValue(item.key));
          this.transactionStack.push(item);
          this.delete(item.key);
          break;
        
        default:
          console.log('improper command made it to the queue');
      }
    }
  }

  // rollsback to the last version of the table before the last
  // 'BEGIN' command.
  rollback(queue, readlineInterface) {
    if (this.transactionStack.length === 0) {
      console.log(`There is no history to rollback! \n` + 
        `transaction queue emptied.\n`);
        queue = [];
    }
    //BUG: question has unexpected behavior, but all other logic is good atm.
    // const rollbackPrompt = `You have selected ROLLBACK, once this transaction is executed\n` +
    //   `it will restore the table to the previous state before beginning\n` +
    //   `this transaction sequence.\n` +
    //   `Would you like to continue? (yes / no)`;

    // readlineInterface.question(rollbackPrompt, (answer) => {
    //   switch(answer) {
    //     case 'yes':
    //       this.execRollback(queue);
    //       break;
    //     case 'no':
    //       break;
        
    //     default: 
    //       console.log(`The answer you have provided is incorrect, please respond yes or no.`);
    //   }
    // });
    this.execRollback(queue);
    return;
  }

  // helper function to rollback(), this function does all the work
  // traverses the stack by popping off an item at a time, restores the 
  //Store to it's last state at the first reached BEGIN command, they work 
  // like bookmarks. you can restore the Store State all the way to zero. 
  execRollback(queue) {
    //Work through the transaction stack and restore values to 
    //previous BEGIN Command
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
        continue;
      }
      queue = [];
    }

    console.log(`Rollback Complete! Transaction History Empty!`);
  }
  
  // informs the user of StoreJS's available commands and features.
  logHelp() {
    const setInstructions = 'SET <key> <value> : adds the key value pair to the store.\n';
    const getInstructions = 'GET <key> : retrieves the value of the specified key.\n';
    const deleteInstructions = 'DELETE <key> : deletes the key:value pair from the store.\n';
    const commitInstructions = 'COMMIT : commits all transactions to the store.\n';
    const beginInstructions = 'BEGIN : sets a bookmark for rollback to restore the state of the store to.\n';
    const rollbackInstructions = 'ROLLBACK : rollsback the state of the table to a previous BEGIN.\n';
    const countInstructions = 'COUNT <value> : returns the number of times the value occurs in the store.\n';
    const quitInstructions = 'QUIT : kills the process and exits the program.\n';
    const helpMessage = '\n\nHere is a list of available commands:\n' + setInstructions +
      getInstructions + deleteInstructions + commitInstructions + beginInstructions +
      rollbackInstructions + countInstructions + quitInstructions;
      
    console.log(`${helpMessage}`);
  }
}
module.exports =  { Store };