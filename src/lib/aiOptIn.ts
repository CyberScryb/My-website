export async function requireAIOptIn(): Promise<boolean> {
  if (localStorage.getItem('CYBERSCRYB_AI_OPT_IN') === 'true') return true;
  return new Promise(resolve => {
    const handler = (e: any) => {
      window.removeEventListener('AI_OPT_IN_RESPONSE', handler);
      if (e.detail.approved) {
        localStorage.setItem('CYBERSCRYB_AI_OPT_IN', 'true');
      }
      resolve(e.detail.approved);
    };
    window.addEventListener('AI_OPT_IN_RESPONSE', handler);
    window.dispatchEvent(new CustomEvent('AI_OPT_IN_REQUEST'));
  });
}
