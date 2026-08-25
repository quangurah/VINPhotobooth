const fs = require('fs');
const path = require('path');
const https = require('https');

const keysFile = path.join(__dirname, 'api_keys.json');
if (!fs.existsSync(keysFile)) {
  console.error(`Không tìm thấy file api_keys.json tại: ${keysFile}`);
  process.exit(1);
}

const raw = fs.readFileSync(keysFile, 'utf8');
const data = JSON.parse(raw);
const keys = data.keys || [];

console.log(`=======================================================`);
console.log(`BẮT ĐẦU KIỂM TRA TOÀN BỘ ${keys.length} KEYS TRONG POOL`);
console.log(`=======================================================\n`);

function checkText(key) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: 'Hi' }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
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
            resolve({ status: 'ERROR', error: `HTTP ${res.statusCode}` });
          }
        }
      });
    });

    req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'ERROR', error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

function checkImage(key) {
  return new Promise((resolve) => {
    const payload = {
      contents: [{
        parts: [{ text: "A small tree, high quality" }]
      }],
      generationConfig: {
        responseModalities: ["IMAGE"]
      }
    };

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.1-flash-image:generateContent?key=${key}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000 // Tối đa 15s cho sinh ảnh test
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
            resolve({ status: 'ERROR', error: `HTTP ${res.statusCode}` });
          }
        }
      });
    });

    req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'ERROR', error: 'Timeout' });
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function run() {
  const results = [];
  
  for (let i = 0; i < keys.length; i++) {
    const keyInfo = keys[i];
    const maskedKey = keyInfo.key.substring(0, 8) + '...' + keyInfo.key.substring(keyInfo.key.length - 8);
    console.log(`[${i+1}/${keys.length}] Đang kiểm tra: ${keyInfo.label} (${maskedKey}) - Active config: ${keyInfo.active !== false}`);
    
    // Gọi song song để test nhanh hơn
    const [textResult, imgResult] = await Promise.all([
      checkText(keyInfo.key),
      checkImage(keyInfo.key)
    ]);

    console.log(`   - Sinh văn bản: ${textResult.status === 'OK' ? '✓ OK' : '✗ LỖI: ' + textResult.error}`);
    console.log(`   - Sinh ảnh:     ${imgResult.status === 'OK' ? '✓ OK' : '✗ LỖI: ' + imgResult.error}`);
    
    results.push({
      index: i + 1,
      label: keyInfo.label,
      group: keyInfo.group,
      configActive: keyInfo.active !== false,
      textStatus: textResult.status,
      textError: textResult.error,
      imageStatus: imgResult.status,
      imageError: imgResult.error,
      maskedKey: maskedKey,
      rawKey: keyInfo.key
    });
  }

  console.log('\n======================================');
  console.log('KẾT QUẢ KIỂM TRA TỔNG HỢP');
  console.log('======================================\n');
  
  results.forEach(r => {
    const activeStr = r.configActive ? "ACTIVE" : "INACTIVE";
    console.log(`Key #${r.index}: ${r.label} (Group: ${r.group}) [Cấu hình: ${activeStr}]`);
    console.log(`   - Key: ${r.maskedKey}`);
    console.log(`   - Sinh Văn bản: ${r.textStatus === 'OK' ? '✓ HOẠT ĐỘNG' : '✗ LỖI: ' + r.textError}`);
    console.log(`   - Sinh Ảnh:     ${r.imageStatus === 'OK' ? '✓ HOẠT ĐỘNG' : '✗ LỖI: ' + r.imageError}`);
    console.log('--------------------------------------');
  });

  // Gợi ý thay đổi trạng thái active
  const suggestions = [];
  results.forEach(r => {
    const canRunBoth = r.textStatus === 'OK' && r.imageStatus === 'OK';
    if (canRunBoth && !r.configActive) {
      suggestions.push(`Nên BẬT (active: true) key #${r.index} (${r.label}) vì chạy tốt cả 2 chức năng.`);
    } else if (!canRunBoth && r.configActive) {
      suggestions.push(`Nên TẮT (active: false) key #${r.index} (${r.label}) vì bị lỗi: ${r.textError || r.imageError}`);
    }
  });

  if (suggestions.length > 0) {
    console.log('\nGỢI Ý CẬP NHẬT TRẠNG THÁI ACTIVE TRONG FILE:');
    suggestions.forEach(s => console.log(`- ${s}`));
  } else {
    console.log('\nChúc mừng! Trạng thái cấu hình active hiện tại đã tối ưu.');
  }
}

run();
