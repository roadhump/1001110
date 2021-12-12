import { Trans } from '@lingui/macro'
import type { GetStaticProps, NextPage } from 'next'


async function loadTranslation(locale: string, isProduction = true) {
  let data
  if (isProduction) {
    data = await import(`./../translations/locales/${locale}/messages`)
  } else {
    data = await import(
      `@lingui/loader!./../translations/locales/${locale}/messages.po`
    )
  }

  return data.messages
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const translation = await loadTranslation(
    ctx.locale!,
    process.env.NODE_ENV === 'production'
  )

  return {
    props: {
      translation
    }
  }
}

const Home: NextPage = () => {
  return (
    <h1><Trans>{'Hello world'}</Trans></h1>
  )
}

export default Home
