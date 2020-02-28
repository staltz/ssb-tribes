const test = require('tape')
const { isMsg, isFeedId } = require('ssb-ref')
const isCloakedId = require('../../lib/is-cloaked-msg-id')
const vector = require('private-group-spec/group/group-id/vector1.json')

const { FeedId, MsgId, CloakedMsgId, GroupId } = require('../../lib/cipherlinks')
const { decodeLeaves } = require('../helpers')

test('Cipherlink/FeedId', t => {
  var feedId = '@YXkE3TikkY4GFMX3lzXUllRkNTbj5E+604AkaO1xbz8=.ed25519'
  var id = new FeedId(feedId)

  var expected = Buffer.concat([
    Buffer.from([0]),  // type = feed
    Buffer.from([0]),  // format = ssb/classic
    Buffer.from('YXkE3TikkY4GFMX3lzXUllRkNTbj5E+604AkaO1xbz8=', 'base64')
  ])

  t.deepEqual(id.toTFK(), expected, 'toTFK')
  t.deepEqual(id.toSSB(), feedId, 'toSSB')

  t.true(isFeedId(new FeedId().mock().toSSB()), 'mock feedId')

  t.end()
})

test('Cipherlink/MsgId', t => {
  var msgId = '%onDYxSjsIb4d3KhgHC7g5wdHLWw/7zygIBvZEx7v6KU=.sha256'
  var id = new MsgId(msgId)

  var expected = Buffer.concat([
    Buffer.from([1]),  // type = msg
    Buffer.from([0]),  // format = ssb/classic
    Buffer.from('onDYxSjsIb4d3KhgHC7g5wdHLWw/7zygIBvZEx7v6KU=', 'base64')
  ])

  t.deepEqual(id.toTFK(), expected, 'toTFK')
  t.deepEqual(id.toSSB(), msgId, 'toSSB')

  t.true(isMsg(new MsgId().mock().toSSB()), 'mock msgId')
  t.end()
})

test('Cipherlink/CloakedMsgId', t => {
  var msgId = '%onDYxSjsIb4d3KhgHC7g5wdHLWw/7zygIBvZEx7v6KU=.cloaked'
  var id = new CloakedMsgId(msgId)

  var expected = Buffer.concat([
    Buffer.from([1]),  // type = msg
    Buffer.from([2]),  // format = ssb/cloaked
    Buffer.from('onDYxSjsIb4d3KhgHC7g5wdHLWw/7zygIBvZEx7v6KU=', 'base64')
  ])

  t.deepEqual(id.toTFK(), expected, 'toTFK')
  t.deepEqual(id.toSSB(), msgId, 'toSSB')


  t.deepEqual(
    new CloakedMsgId(
      Buffer.from('onDYxSjsIb4d3KhgHC7g5wdHLWw/7zygIBvZEx7v6KU=', 'base64')
    ).toSSB(),
    msgId,
    'can initialise with a buffer'
  )

  t.true(isCloakedId(new CloakedMsgId().mock().toSSB()), 'mock cloakedId')
  t.end()
})

test('Cipherlink/GroupId', t => {
  decodeLeaves(vector)
  const { group_init_msg_id, group_key } = vector.input

  var group_id = new GroupId(
    new MsgId(group_init_msg_id).toTFK(),
    group_key
  )

  t.equal(group_id.toSSB(), vector.output.group_id, 'correctly construct group_id')
  t.end()
})