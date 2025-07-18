const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');


// URL ke backend API Anda
const API_URL = 'http://localhost:3000/api/chat';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.focus();

  // Tampilkan pesan "thinking..." sementara menunggu respons
  const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    // 3. Kirim pesan pengguna ke backend API menggunakan fetch()
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: userMessage}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reply || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botReplyMarkdown = data.reply;

    // 4. Konversi Markdown ke HTML yang aman
    // `marked.parse` mengubah Markdown (e.g., # Judul) menjadi HTML (e.g., <h1>Judul</h1>)
    const dirtyHtml = marked.parse(botReplyMarkdown);
    // `DOMPurify.sanitize` membersihkan HTML dari kode berbahaya (mencegah XSS)
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);

    // 5. Ganti pesan "thinking..." dengan balasan HTML yang sudah bersih
    thinkingMessageElement.innerHTML = cleanHtml;

  } catch (error) {
    console.error('Error fetching bot reply:', error);
    // Tampilkan pesan error jika terjadi masalah
    thinkingMessageElement.textContent = 'Sorry, something went wrong. Please try again.';
  } finally {
    // Pastikan chat box selalu scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg
}
