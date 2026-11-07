<script setup lang="ts">
// お問い合わせフォーム(Web3Forms へブラウザから直接送信)
// 配置先: app/components/ContactForm.vue
// アクセスキーは公開前提の値なので、クライアント側で使っても問題ありません。
const config = useRuntimeConfig()
const accessKey = config.public.web3formsAccessKey as string

type Status = 'idle' | 'sending' | 'success' | 'error'
const status = ref<Status>('idle')
const errorMessage = ref('')

// 無料の hCaptcha を使うための Web3Forms 公式スクリプト
useHead({
  script: [
    { src: 'https://web3forms.com/client/script.js', async: true, defer: true },
  ],
})

async function onSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  status.value = 'sending'
  errorMessage.value = ''

  try {
    // hCaptcha の応答トークン(h-captcha-response)もフォームから自動で拾われます
    const json = JSON.stringify(Object.fromEntries(new FormData(form)))
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: json,
    })
    const data = await res.json()

    if (res.ok && data.success) {
      status.value = 'success'
      form.reset()
    } else {
      status.value = 'error'
      errorMessage.value = data.message ?? '送信に失敗しました。'
    }
  } catch {
    status.value = 'error'
    errorMessage.value = 'ネットワークエラーが発生しました。時間をおいてお試しください。'
  }
}
</script>

<template>
  <form class="contact-form" @submit.prevent="onSubmit">
    <!-- Web3Forms 設定 -->
    <input type="hidden" name="access_key" :value="accessKey" />
    <input type="hidden" name="subject" value="ポートフォリオサイトからのお問い合わせ" />
    <input type="hidden" name="from_name" value="Portfolio Site" />

    <!-- ハニーポット: 人間には見えない。ボットがチェックすると弾かれる -->
    <input
      type="checkbox"
      name="botcheck"
      class="botcheck"
      tabindex="-1"
      autocomplete="off"
    />

    <label>
      お名前
      <input type="text" name="name" required autocomplete="name" />
    </label>

    <label>
      メールアドレス
      <input type="email" name="email" required autocomplete="email" />
    </label>

    <label>
      メッセージ
      <textarea name="message" rows="6" required />
    </label>

    <!-- 無料の hCaptcha(キー設定不要) -->
    <div class="h-captcha" data-captcha="true" />

    <button type="submit" :disabled="status === 'sending'">
      {{ status === 'sending' ? '送信中…' : '送信する' }}
    </button>

    <p v-if="status === 'success'" class="result ok" role="status">
      送信しました。お問い合わせありがとうございます。
    </p>
    <p v-if="status === 'error'" class="result ng" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="!accessKey" class="result ng">
      Web3Forms のアクセスキーが未設定です(.env を確認してください)。
    </p>
  </form>
</template>

<style scoped>
.contact-form {
  display: grid;
  gap: 1rem;
  max-width: 32rem;
}
label {
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
}
input[type='text'],
input[type='email'],
textarea {
  padding: 0.6rem 0.75rem;
  border: 1px solid #bbb;
  border-radius: 6px;
  font: inherit;
}
button {
  padding: 0.7rem 1rem;
  border: 0;
  border-radius: 6px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.botcheck {
  display: none;
}
.result.ok {
  color: #1a7f37;
}
.result.ng {
  color: #cf222e;
}
</style>