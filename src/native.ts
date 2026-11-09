import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = () => Capacitor.isNativePlatform();

export async function initNative() {
  if (!isNative()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch {}
  try {
    await SplashScreen.hide({ fadeOutDuration: 400 });
  } catch {}
}

/** Descarga un archivo en navegador, o lo comparte/guarda en Android (los blobs no se descargan en WebView). */
export async function saveFile(filename: string, content: string, mime: string): Promise<void> {
  if (isNative()) {
    const res = await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    });
    await Share.share({ title: filename, url: res.uri, dialogTitle: 'Guardar o enviar respaldo' });
    return;
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
