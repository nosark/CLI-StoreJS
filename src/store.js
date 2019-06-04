

class Store {
  constructor() {
    // the transaction stack will keep track of
    // all transactions following the 'BEGIN' command
    // flush empty when new begin starts
    this.transactionStack = []; 

    //keeps track of values from key duplicates etc allowing us to restore previous values
    this.previousTransactionValues = []; 
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
    // TODO: handle duplicates and rollbacks later
  }
  
  // deletes key value pair from the table using 'DELETE'
  // command. TODO: take rollbacks into account 
  delete(key) {
    if (key in this.table) {
      delete this.table[key];
    } else {
      console.log(`ERROR: ${key} could not be found in the table!!!`);
    }
  }

  // commits all transactions in the transaction stack in memory
  // using 'COMMIT' command.
  commit() {
    //TODO:
  }

  // rollsback to the last version of the table before the last
  // 'BEGIN' command.
  rollback() {
    if (this.transactionStack.length === 0) {
      console.log(`There is nothing to rollback!`); 
      return;
    }

    //work through the transaction stack and previous values
    // stack and restore values to previous BEGIN Command
    while (transactionStack.length > 0) {
      const stackItem = this.transactionStack.pop();
      const previousValue = this.previousTransactionValues.pop();
      if (stackItem[0] === 'SET') {
        // restore previous value by setting old value
        // or if there was no key previously delete.
      } else if (stackItem[0] === 'DELETE') {
        //restore previous value w set or null the key
      } else {
        console.log(`rollback does not need to handle this command state...`);
        continue;
      }
    }

    console.log(`Rollback Complete!`);
  }

  // NOTE: function may have no purpose.
  // TODO: begin initiates tracking each transaction 
  /*
  begin() {

  }
  */

  // Removes transaction and previous value histories by
  // emptying both Store(this) objects stacks
  flushTransactionHistory() {
    this.transactionStack = [];
    this.previousTransactionValues = [];
  }
}

module.exports =  { Store };