// @nuxt/eslint が `nuxt prepare` / `nuxt dev` 時に .nuxt/eslint.config.mjs を生成します。
// 初回は `npm install`(postinstall で nuxt prepare が走ります)のあとに lint を実行してください。
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  { ignores: ['worker-configuration.d.ts'] },
  // フォーマットは Prettier に任せるため、競合する ESLint ルールを無効化(最後に置く)
  prettier,
)
