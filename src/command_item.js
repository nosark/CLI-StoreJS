
// a way to store commands in the commit queue and the history related stacks
// inside of the store object
class CommandItem {
  constructor(command, key, value) {
    this.command = command;
    this.key = key;
    this.value = value;
    this.previousTableValue = null;
  }

  getKey() {
    return this.key;
  }

  getValue() {
    return this.value;
  }

  getPreviousTableValue() {
    return this.previousTableValue;
  }

  getCommandType() {
    return this.command;
  }

  setPreviousTableValue(value) {
    this.previousTableValue = value;
  }
}
module.exports = { CommandItem };

//TODO: contemplating inline objects on the fly versus 
//classes for set and delete items 
//NOTE: This is where you left off.