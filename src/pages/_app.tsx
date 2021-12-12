import { Amplify, Auth, Hub } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './../aws-exports';
import type {AppProps} from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { CognitoUserAmplify } from '@aws-amplify/ui';
import { useRouter } from 'next/router';
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react';
import { en, es, fr } from 'make-plural/plurals'
import { Switcher } from '../components/Switcher';

Amplify.configure(awsExports);

i18n.loadLocaleData({
  en: { plurals: en },
  fr: { plurals: fr },
  es: { plurals: es },
  pseudo: { plurals: en }
})

const MyApp = ({Component, pageProps}: AppProps) => {

  const [user, setUser] = useState<CognitoUserAmplify>()

  useEffect(() => {
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          setUser(await Auth.currentAuthenticatedUser());
          break;
        case 'signOut':
          setUser(void 0);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });


  }, []);

  useEffect(() => {
    const run = async () => {
      setUser(await Auth.currentAuthenticatedUser());
    }

    run();

  }, [])

  const router = useRouter()
  const locale = router.locale || router.defaultLocale!
  const firstRender = useRef(true)

  if (pageProps.translation && firstRender.current) {
    //load the translations for the locale
    i18n.load(locale, pageProps.translation)
    i18n.activate(locale)
    // render only once
    firstRender.current = false
  }

  useEffect(() => {
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
  }, [locale, pageProps.translation])



  return (
    <Authenticator socialProviders={['facebook', 'google', 'apple',]}>
      {({ signOut, user }) => (
        <div>
        <I18nProvider i18n={i18n}>
          <main>
            <h1>Hello {(user as any).attributes.name}</h1>
            <button onClick={signOut}>Sign out</button>
            <Switcher />


            <Component {...pageProps} />

          </main>
        </I18nProvider>
        </div>
      )}
    </Authenticator>
  );

}

export default MyApp
