const fs = require('fs');
const path = require('path');
const https = require('https');

const keysFile = path.join(__dirname, 'api_keys.json');
const raw = fs.readFileSync(keysFile, 'utf8');
const data = JSON.parse(raw);
const keys = data.keys || [];

console.log(`Bắt đầu kiểm tra ${keys.length} keys trong pool...\n`);

function checkKey(keyInfo) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: 'Hi' }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${keyInfo.key}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ status: 'OK', error: null });
        } else {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ status: 'ERROR', error: parsed.error ? parsed.error.message : responseBody });
          } catch (e) {
            resolve({ status: 'ERROR', error: `Status ${res.statusCode}: ${responseBody}` });
          }
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERROR', error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'ERROR', error: 'Request Timeout (8s)' });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  const results = [];
  let okCount = 0;
  
  for (let i = 0; i < keys.length; i++) {
    const keyInfo = keys[i];
    const maskedKey = keyInfo.key.substring(0, 8) + '...' + keyInfo.key.substring(keyInfo.key.length - 8);
    process.stdout.write(`[${i+1}/${keys.length}] Đang test key: ${keyInfo.label} (${maskedKey})... `);
    
    const result = await checkKey(keyInfo);
    if (result.status === 'OK') {
      console.log('✓ HOẠT ĐỘNG');
      okCount++;
    } else {
      console.log(`✗ LỖI: ${result.error}`);
    }
    
    results.push({
      label: keyInfo.label,
      group: keyInfo.group,
      status: result.status,
      error: result.error,
      key: keyInfo.key
    });
  }

  console.log('\n======================================');
  console.log(`KẾT QUẢ: ${okCount}/${keys.length} keys hoạt động tốt.`);
  console.log('======================================\n');
}

run();
