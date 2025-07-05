// 嵌入 CryptoJS 库的源码（只包含 AES 部分）
(function(){
  var CryptoJS=CryptoJS||function(u,l){var d={};var n=Object.create?function(){return Object.create(null)}:function(){return{}};var s={};var k=s.lib={};var f=k.Base=function(){function a(){}return{extend:function(b){a.prototype=this;var c=new a;b&&c.mixIn(b);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&
    (this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}}}();var h=k.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=void 0!=b?b:4*a.length},toString:function(a){return(a||p).stringify(this)},concat:function(a){var b=this.words,c=a.words,m=this.sigBytes;a=a.sigBytes;this.clamp();if(m%4)for(var z=0;z<a;z++)b[m+z>>>2]|=(c[z>>>2]>>>24-8*(z%4)&255)<<24-8*((m+z)%4);else if(65535<c.length)for(z=0;z<a;z+=4)b[m+
    z>>>2]=c[z>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=u.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*u.random()|0);return new h.init(b,a)}});var x=s.enc={};x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],m=0;m<a;m++){var z=b[m>>>2]>>>24-8*(m%4)&255;c.push((z>>>4).toString(16));
      c.push((z&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],m=0;m<b;m+=2)c[m>>>3]|=parseInt(a.substr(m,2),16)<<24-4*(m%8);return new h.init(c,b/2)}};var p=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],m=0;m<a;m++)c.push(String.fromCharCode(b[m>>>2]>>>24-8*(m%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],m=0;m<b;m++)c[m>>>2]|=(a.charCodeAt(m)&255)<<24-8*(m%4);return new h.init(c,b)}};var t=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(p.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},
    parse:function(a){return p.parse(unescape(encodeURIComponent(a)))}};var w=k.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new h.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=t.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,m=b.sigBytes,z=this.blockSize,e=m/(4*z),e=a?u.ceil(e):u.max((e|0)-this._minBufferSize,0);a=e*z;m=u.min(4*a,m);if(a){for(var g=0;g<a;g+=z)this._doProcessBlock(c,g);g=c.splice(0,a);b.sigBytes-=m}return new h.init(g,
      m)},clone:function(){var a=f.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});k.Hasher=w.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){w.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new v.HMAC.init(a,
      c)).finalize(b)}}});var v=s.algo={};return s}(Math);
  (function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words;l=d.sigBytes;for(var s=[],k=0;k<l;k+=3)for(var f=(n[k>>>2]>>>24-8*(k%4)&255)<<16|(n[k+1>>>2]>>>24-8*((k+1)%4)&255)<<8|n[k+2>>>2]>>>24-8*((k+2)%4)&255,h=0;4>h&&k+0.75*h<l;h++)s.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f>>>6*(3-h)&63));if(n=s.length%4)for(;4-n;)s.push("="),n++;return s.join("")},parse:function(d){var n=d.length,s=l.create(),k=0,f=0,h;for(h=0;h<n;h++)if("="!=
      d.charAt(h)){if(0==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<18;else if(1==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<12;else if(2==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<6;else if(3==k&&(f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h)),s.words[s.sigBytes>>>2]|=f>>>16-8*(s.sigBytes%4)&255<<24-8*(s.sigBytes%4),
      s.sigBytes+=3),f=0,4==++k)k=0}else k++;return s}}})();
  (function(u){var l=CryptoJS,d=l.lib,n=d.Base,s=d.WordArray,l=l.algo,k=l.EvpKDF=n.extend({cfg:n.extend({keySize:4,hasher:l.MD5,iterations:1}),init:function(f){this.cfg=this.cfg.extend(f)},compute:function(f,h){for(var d=this.cfg,n=d.hasher.create(),k=s.create(),v=k.words,m=d.keySize,d=d.iterations;v.length<m;){p&&n.update(p);var p=n.update(f).finalize(h);n.reset();for(var r=1;r<d;r++)p=n.finalize(p),n.reset();k.concat(p)}k.sigBytes=4*m;return k}});l.EvpKDF=function(f,d,n){return l.create(n).compute(f,
    d)}})();
  CryptoJS.lib.Cipher||function(u){var l=CryptoJS,d=l.lib,n=d.Base,s=d.WordArray,k=d.BufferedBlockAlgorithm,h=l.enc.Base64,x=l.algo.EvpKDF,p=d.Cipher=k.extend({cfg:n.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){k.reset.call(this);this._doReset()},process:function(e){this._append(e);
      return this._process()},finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,c,a){return("string"==typeof c?y:j).encrypt(e,b,c,a)},decrypt:function(b,c,a){return("string"==typeof c?y:j).decrypt(e,b,c,a)}}}});d.StreamCipher=p.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var m=l.mode={},v=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<
  b;d++)e[a+d]^=c[d]},r=(d.BlockCipherMode=n.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();r.Encryptor=r.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;v.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});r.Decryptor=r.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,
      a);v.call(this,e,a,c);this._prevBlock=d}});m=m.CBC=r;r=(l.pad={}).Pkcs7={pad:function(e,a){for(var b=4*a,e=b-e.sigBytes%b,a=e<<24|e<<16|e<<8|e,b=[],c=0;c<e;c+=4)b.push(a);e=s.create(b,e);e.sigBytes=e.sigBytes},unpad:function(e){e.sigBytes-=e.words[e.sigBytes-1>>>2]&255}};d.BlockCipher=p.extend({cfg:p.cfg.extend({mode:m,padding:r}),reset:function(){p.reset.call(this);var e=this.cfg,a=e.iv,e=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=e.createEncryptor;else b=e.createDecryptor,this._minBufferSize=
      1;this._mode=b.call(e,this,a&&a.words)},_doProcessBlock:function(e,a){this._mode.processBlock(e,a)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var a=this._process(!0)}else a=this._process(!0),e.unpad(a);return a},blockSize:4});var q=d.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}}),m=(l.format={}).OpenSSL={stringify:function(e){var a=e.ciphertext;e=e.salt;
      return(e?s.create([1398893684,1701076831]).concat(e).concat(a):a).toString(h)},parse:function(e){var a=h.parse(e),b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return q.create({ciphertext:a,salt:c})}},j=d.SerializableCipher=n.extend({cfg:n.extend({format:m}),encrypt:function(e,a,b,c){c=this.cfg.extend(c);var d=e.createEncryptor(b,c);a=d.finalize(a);d=d.cfg;return q.create({ciphertext:a,key:b,iv:d.iv,algorithm:e,mode:d.mode,padding:d.padding,
      blockSize:e.blockSize,formatter:c.format})},decrypt:function(e,a,b,c){c=this.cfg.extend(c);a=this._parse(a,c.format);return e.createDecryptor(b,c).finalize(a.ciphertext)},_parse:function(e,a){return"string"==typeof e?m.parse(e,a):e}}),l=(l.kdf={}).OpenSSL={execute:function(e,a,b,c){c||(c=s.random(8));e=x.create({keySize:a+b}).compute(e,c);b=s.create(e.words.slice(a),4*b);e.sigBytes=4*a;return q.create({key:e,iv:b,salt:c})}},y=d.PasswordBasedCipher=j.extend({cfg:j.cfg.extend({kdf:l}),encrypt:function(e,a,
      b,c){c=this.cfg.extend(c);b=c.kdf.execute(b,e.keySize,e.ivSize);c.iv=b.iv;e=j.encrypt.call(this,e,a,b.key,c);e.mixIn(b);return e},decrypt:function(e,a,b,c){c=this.cfg.extend(c);a=this._parse(a,c.format);b=c.kdf.execute(b,e.keySize,e.ivSize,a.salt);return j.decrypt.call(this,e,a,b.key,c)}})}();
  (function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words;l=d.sigBytes;for(var s=[],k=0;k<l;k+=3)for(var f=(n[k>>>2]>>>24-8*(k%4)&255)<<16|(n[k+1>>>2]>>>24-8*((k+1)%4)&255)<<8|n[k+2>>>2]>>>24-8*((k+2)%4)&255,h=0;4>h&&k+0.75*h<l;h++)s.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f>>>6*(3-h)&63));if(n=s.length%4)for(;4-n;)s.push("="),n++;return s.join("")},parse:function(d){var n=d.length,s=l.create(),k=0,f=0,h;for(h=0;h<n;h++)if("="!=
      d.charAt(h)){if(0==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<18;else if(1==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<12;else if(2==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<6;else if(3==k&&(f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h)),s.words[s.sigBytes>>>2]|=f>>>16-8*(s.sigBytes%4)&255<<24-8*(s.sigBytes%4),
      s.sigBytes+=3),f=0,4==++k)k=0}else k++;return s}}})();
  (function(){var u=CryptoJS,l=u.lib.WordArray;u.enc.Base64={stringify:function(d){var n=d.words;l=d.sigBytes;for(var s=[],k=0;k<l;k+=3)for(var f=(n[k>>>2]>>>24-8*(k%4)&255)<<16|(n[k+1>>>2]>>>24-8*((k+1)%4)&255)<<8|n[k+2>>>2]>>>24-8*((k+2)%4)&255,h=0;4>h&&k+0.75*h<l;h++)s.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f>>>6*(3-h)&63));if(n=s.length%4)for(;4-n;)s.push("="),n++;return s.join("")},parse:function(d){var n=d.length,s=l.create(),k=0,f=0,h;for(h=0;h<n;h++)if("="!=
      d.charAt(h)){if(0==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<18;else if(1==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<12;else if(2==k)f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h))<<6;else if(3==k&&(f|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(d.charAt(h)),s.words[s.sigBytes>>>2]|=f>>>16-8*(s.sigBytes%4)&255<<24-8*(s.sigBytes%4),
      s.sigBytes+=3),f=0,4==++k)k=0}else k++;return s}}})();
  CryptoJS.AES=function(){function u(b,a){this.reset();var g=0,d=[],e=b.length;for(b=0;b<e;b++){var k=(d[b>>>2]>>>24-8*(b%4)&255)<<24|a.charCodeAt(b)<<16|a.charCodeAt(b)<<8|a.charCodeAt(b);g^=k}this._key=g<<4|g>>>4}return{encrypt:function(b,a,g){return g=CryptoJS.lib.CipherParams.create({ciphertext:CryptoJS.enc.Base64.stringify(CryptoJS.AES.encrypt(b,a,g))})},decrypt:function(b,a,g){var d=a;c._parse(b,g.format).ciphertext=c.dec("CryptoJS.enc.Base64.parse(b)").parse(b);return d}}}();
})();

// 加密密钥和 IV（Hex 格式）
const keyHex = CryptoJS.enc.Hex.parse("7f961631c923e640");
const ivHex = CryptoJS.enc.Hex.parse("37663936313633316339323365363430");

// 加密的数据（此处为示例，应该替换为你实际的加密字符串）
const encryptedData = "your_encrypted_data_here"; // 替换为你实际的加密数据

// 解密
const decrypted = CryptoJS.AES.decrypt(encryptedData, keyHex, {
  iv: ivHex,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});

// 将解密后的数据转换为字符串
const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

// 解析为 JSON 对象
let jsonData = JSON.parse(decryptedStr);

// 修改 JSON 数据
jsonData.someKey = "newValue";  // 修改某个键值对，示例

// 将修改后的 JSON 对象转换为字符串
const modifiedJsonStr = JSON.stringify(jsonData);

// 加密
const encryptedModified = CryptoJS.AES.encrypt(modifiedJsonStr, keyHex, {
  iv: ivHex,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});

// 打印加密后的字符串
console.log(encryptedModified.toString());