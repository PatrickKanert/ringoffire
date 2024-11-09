import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(MatButtonModule, MatDialogModule, MatIconModule),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ring-of-fire-316c1',
          appId: '1:798263090132:web:dd9b6e0c0d43497f0d9441',
          storageBucket: 'ring-of-fire-316c1.firebasestorage.app',
          apiKey: 'AIzaSyCDrf6PQ_vse88nDHvk_IbzZHH0ItJsCys',
          authDomain: 'ring-of-fire-316c1.firebaseapp.com',
          messagingSenderId: '798263090132',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideDatabase(() => getDatabase())),
  ],
};
