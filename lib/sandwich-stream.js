var Readable = require('stream').Readable;
var PassThrough = require('stream').PassThrough;

function SandwichStream(options) {
  Readable.call(this, options);
  options = options || {};
  this._streamsActive = false;
  this._streamsAdded = false;
  this._streams = [];
  this._currentStream = undefined;
  this._errorsEmitted = false;

  if (options.head) {
    this._head = options.head;
  }
  if (options.tail) {
    this._tail = options.tail;
  }
  if (options.separator) {
    this._separator = options.separator;
  }
}

SandwichStream.prototype = Object.create(Readable.prototype, {
  constructor: SandwichStream
});

SandwichStream.prototype._read = function () {
  if (!this._streamsAdded) {
    this.emit('error', new Error('SandwichStream no streams added error'));
    return;
  }

  if (!this._streamsActive) {
    this._streamsActive = true;
    this._pushHead();
    this._streamNextStream();
  }
};

SandwichStream.prototype.add = function (newStream) {
  this._streamsAdded = true;
  this._streams.push(newStream);
  newStream.on('error', this._substreamOnError.bind(this));
};

SandwichStream.prototype._substreamOnError = function (error) {
  this._errorsEmitted = true;
  this.emit('error', error);
};

SandwichStream.prototype._pushHead = function () {
  if (this._head) {
    this.push(this._head);
  }
};

SandwichStream.prototype._streamNextStream = function () {
  if (this._nextStream()) {
    this._currentStream.on('data', this._currentStreamOnData.bind(this));
    this._currentStream.on('end', this._currentStreamOnEnd.bind(this));
  }
  else {
    this._pushTail();
    this.push(null);
  }
};

SandwichStream.prototype._nextStream = function () {
  this._currentStream = this._streams.shift();
  return this._currentStream !== undefined;
};

SandwichStream.prototype._currentStreamOnData = function (chunk) {
  if (!this._errorsEmitted) {
    this.push(chunk);
  }
};

SandwichStream.prototype._currentStreamOnEnd = function () {
  this._pushSeparator();
  this._streamNextStream();
};

SandwichStream.prototype._pushSeparator = function () {
  if (this._streams.length > 0 && this._separator) {
    this.push(this._separator);
  }
};

SandwichStream.prototype._pushTail = function () {
  if (this._tail) {
    this.push(this._tail);
  }
};

function sandwichStream(options) {
  var stream = new SandwichStream(options);
  return stream;
}

module.exports = sandwichStream;
