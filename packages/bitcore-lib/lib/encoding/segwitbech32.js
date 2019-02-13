var sha256 = require('../crypto/hash').sha256;
var ripemd160 = require('../crypto/hash').ripemd160;
var createChecksum = require('./bech32').createChecksum;

// convert bigint to byte array (uint8)
function bigintToByteArray(bigint) {
  var ret = [];

  while (bigint.gt(bn_0)) {
    ret.push(bigint.and(bn_255).toNumber());
    bigint = bigint.shrn(8);
  }

  return ret;
}

// create bech32 address from public key
function makeBech32Address(keypair) {
  var key_bytes = [];

  var bytes_public_x = bigintToByteArray(keypair[0]);
  while (bytes_public_x.length < 32) bytes_public_x.push(0);
  key_bytes.push.apply(key_bytes, bytes_public_x);

  if (keypair[1].isOdd()) key_bytes.push(0x03);
  else key_bytes.push(0x02);

  key_bytes = key_bytes.reverse();

  var sha_result_1 = sha256(key_bytes);
  var keyhash = ripemd160(sha_result_1);

  var redeemscript = [0x00, 0x14];
  redeemscript.push.apply(redeemscript, keyhash);

  var value = 0;
  var bits = 0;

  var result = [0];
  for (let i = 0; i < 20; i++) {
    value = ((value << 8) | keyhash[i]) & 0xffffff;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      result.push((value >> bits) & 0x1f);
    }
  }

  var address = 'bc1';
  for (let i = 0; i < result.length; i++) {
    address += bech32Chars[result[i]];
  }

  var checksum = createChecksum('bc', result);
  for (let i = 0; i < checksum.length; ++i) {
    address += bech32Chars[checksum[i]];
  }
  return address;
}
