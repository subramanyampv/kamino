const { SaxVisitor } = require('./sax-visitor');
const { SaxWriter } = require('./sax-writer');
const dom = require('./dom');

// TODO make SaxVisitor and SaxWriter private
// TODO add update(xmlFile, values) function
module.exports = {
  SaxVisitor,
  SaxWriter,
  dom
};
