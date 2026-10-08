import '../lib/polyfill';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import Loading from '../components/Loading';
import { ADMIN_EMAIL } from '../constants/config';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('getSession error:', error.message);
      }
      setSession(session);
      setIsReady(true);
    }).catch(err => {
      console.error('getSession exception:', err);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'auth';
    
    if (!session) {
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
    } else if (session) {
      // User is logged in
      const isAdmin = session.user.email === ADMIN_EMAIL;
      const inAdminGroup = segments[0] === 'admin';
      const inUserGroup = segments[0] === 'user';
      const isInstructions = segments[1] === 'instructions';
      
      if (isAdmin && !inAdminGroup) {
        router.replace('/admin/home');
      } else if (!isAdmin) {
        (async () => {
          const accepted = await AsyncStorage.getItem('hasAcceptedInstructions');
          if (accepted !== 'true' && !isInstructions) {
            router.replace('/user/instructions');
          } else if (accepted === 'true' && !inUserGroup) {
            router.replace('/user/home');
          }
        })();
      }
    }
  }, [session, isReady, segments]);

  if (!isReady) {
    return <Loading />;
  }

  return <Slot />;
}
