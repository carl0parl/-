# Laboratorio de Comunicación, Voz y Destreza

App de entrenamiento personal (React + Vite + Tailwind + Framer Motion) empaquetada para Android con Capacitor.
Todos los datos se guardan localmente en el dispositivo; la fuente tipográfica va incluida (funciona sin conexión).

## Desarrollo web
```bash
npm install
npm run dev
```

## Obtener el APK
**Opción A (sin instalar nada): GitHub Actions.** Cada push a `main` o a una rama `claude/**` ejecuta
`.github/workflows/android-apk.yml`, que compila el APK y lo publica en la pestaña **Releases** (y como artefacto de la ejecución).
También puede lanzarse manualmente desde *Actions → Build Android APK → Run workflow*.

**Opción B (local).** Requiere JDK 21 y Android SDK (`ANDROID_HOME`):
```bash
npm install
npm run android:debug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```
Instalar en el teléfono: copiar el APK y permitir "instalar apps desconocidas".

## Notas Android
- Permiso de micrófono (`RECORD_AUDIO`) para el monitor de dB; si se niega, la app usa el modo simulado.
- Exportar JSON/CSV abre el menú *Compartir* de Android (los blobs no se descargan en WebView).
- Los gráficos y la rúbrica son herramientas de autoseguimiento, no sustituyen a un fonoaudiólogo, médico o terapeuta ocupacional.
