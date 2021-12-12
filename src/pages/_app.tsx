import { Amplify, Auth, Hub } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './../aws-exports';
import type {AppProps} from 'next/app';
import { useEffect, useState } from 'react';
import { CognitoUserAmplify } from '@aws-amplify/ui';
Amplify.configure(awsExports);

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

  return (
    <Authenticator socialProviders={['facebook', 'google', 'apple',]}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {(user as any).attributes.name}</h1>
          <button onClick={signOut}>Sign out</button>

          <Component {...pageProps} />

        </main>
      )}
    </Authenticator>
  );
}

export default MyApp
