// Copy shortcut command only; does not execute actions in the chat provider.
(() => {
  const toast = document.getElementById('shortcut-toast');
  if (!toast) return;
  document.querySelectorAll('.shortcut-copy[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const command = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(command);
        toast.textContent = command + ' 복사 완료 · 리핀 대화창에 붙여넣어 사용하세요.';
      } catch (error) {
        toast.textContent = '자동 복사가 제한돼요. 단축어 이름 ' + command + '을 선택해 직접 복사해 주세요.';
      }
    });
  });
})();
