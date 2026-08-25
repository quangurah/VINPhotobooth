const fs = require('fs');
const path = require('path');
const https = require('https');

const keysFile = path.join(__dirname, 'api_keys.json');
const raw = fs.readFileSync(keysFile, 'utf8');
const data = JSON.parse(raw);
const keys = data.keys || [];
const apiKey = keys[0].key;

console.log('Testing image generation with key:', keys[0].label);

const prompt = 'A simple red apple on a white table, studio lighting, photo 1:1';

const postData = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    responseModalities: ["IMAGE"]
  }
});

// Thử với các model khác nhau: gemini-3-pro-image, gemini-3.5-flash (không có image mod), imagen-3.0-generate-002
const models = ['imagen-3.0-generate-002', 'gemini-3-pro-image', 'gemini-3.1-flash-image'];

function testModel(model) {
  return new Promise((resolve) => {
    console.log(`Testing model: ${model}...`);
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        console.log(`Status code for ${model}: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(responseBody);
          if (res.statusCode === 200) {
            console.log(`✓ Success ${model}`);
            // Check if there is image data
            if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
              const parts = parsed.candidates[0].content.parts;
              const hasImage = parts && parts.some(p => p.inlineData);
              console.log(`  Has image data: ${hasImage}`);
            }
            resolve(true);
          } else {
            console.log(`✗ Error ${model}:`, parsed.error ? parsed.error.message : responseBody);
            resolve(false);
          }
        } catch (e) {
          console.log(`✗ Error parsing JSON for ${model}:`, responseBody.substring(0, 300));
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`✗ Request error for ${model}:`, err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`✗ Timeout for ${model}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const m of models) {
    await testModel(m);
    console.log('-----------------------------------');
  }
}

run();
