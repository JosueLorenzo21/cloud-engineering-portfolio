const imageInput = document.getElementById('imageInput');
const analyzeButton = document.getElementById('analyzeButton');
const statusText = document.getElementById('status');
const preview = document.getElementById('preview');
const caption = document.getElementById('caption');
const confidence = document.getElementById('confidence');
const tagsList = document.getElementById('tagsList');

const functionBaseUrl = 'https://imageanalyzerfunc2026.azurewebsites.net/api';

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];

  if (!file) {
    preview.style.display = 'none';
    preview.src = '';
    return;
  }

  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
});

analyzeButton.addEventListener('click', async () => {
  try {
    const file = imageInput.files[0];

    if (!file) {
      statusText.textContent = 'Please select an image first.';
      return;
    }

    statusText.textContent = 'Requesting upload URL...';
    caption.textContent = '-';
    confidence.textContent = '-';
    tagsList.innerHTML = '';

    const uploadUrlResponse = await fetch(`${functionBaseUrl}/generateUploadUrl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name })
    });

    if (!uploadUrlResponse.ok) {
      throw new Error('Failed to get upload URL.');
    }

    const uploadData = await uploadUrlResponse.json();
    const uploadUrl = uploadData.uploadUrl;

    statusText.textContent = 'Uploading image to Blob Storage...';

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error('Image upload failed.');
    }

    statusText.textContent = 'Analyzing image with Azure AI Vision...';

    const analyzeResponse = await fetch(`${functionBaseUrl}/analyzeImage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name })
    });

    if (!analyzeResponse.ok) {
      throw new Error('Image analysis failed.');
    }

    const result = await analyzeResponse.json();

    caption.textContent = result.caption || 'No caption returned';
    confidence.textContent = result.confidence
      ? `${(result.confidence * 100).toFixed(2)}%`
      : '-';

    tagsList.innerHTML = '';

    if (result.tags && result.tags.length > 0) {
      result.tags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = `${tag.name} (${(tag.confidence * 100).toFixed(2)}%)`;
        tagsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No tags returned';
      tagsList.appendChild(li);
    }

    statusText.textContent = 'Analysis completed successfully.';
  } catch (error) {
    console.error(error);
    statusText.textContent = `Error: ${error.message}`;
  }
});
