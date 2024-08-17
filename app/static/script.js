let currentTab = 'curl';

    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.tab:nth-child(${tab === 'curl' ? 1 : 2})`).classList.add('active');
      document.getElementById('input').placeholder = `Введите ваш ${tab} запрос здесь...`;
    }

    async function transformRequest() {
      const input = document.getElementById('input').value;
      const format = document.getElementById('format').value;
      const output = document.getElementById('output');

      // Преобразование многострочного ввода в однострочный
      const singleLineInput = input.replace(/\n/g, ' ').trim();

      const requestData = {
        request_type: currentTab,
        target: format,
        data_str: singleLineInput
      };

      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('Ошибка при обработке запроса');
        }

        const data = await response.json();
        output.textContent = data.request_string;
        document.querySelector('.copy-icon').style.display = 'block';
      } catch (error) {
        output.textContent = 'Произошла ошибка: ' + error.message;
        document.querySelector('.copy-icon').style.display = 'none';
      }
    }

    function copyToClipboard() {
      const output = document.getElementById('output');
      const textarea = document.createElement('textarea');
      textarea.value = output.textContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      const copyIcon = document.querySelector('.copy-icon');
      copyIcon.innerHTML = '<path d="M20 6L9 17L4 12" stroke="#FFD43B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      setTimeout(() => {
        copyIcon.innerHTML = '<path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="#4B8BBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="#4B8BBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      }, 2000);
    }

    // Инициализация
    document.querySelector('.copy-icon').style.display = 'none';
