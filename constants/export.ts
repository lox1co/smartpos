import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export function csvCell(value: unknown): string {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
}

function safeName(name: string): string {
  return name.replace(/[^\w.\-]+/g, '_');
}

export async function shareTextFile(
  filename: string,
  contents: string,
  mimeType: string
): Promise<string | null> {
  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    return null;
  }
  const file = new File(Paths.document, safeName(filename));
  file.create({ overwrite: true });
  file.write(contents);
  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: filename });
  return file.uri;
}

export async function shareHtmlAsPdf(html: string, dialogTitle: string): Promise<string | null> {
  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    return null;
  }
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle,
  });
  return uri;
}

export async function printHtml(html: string): Promise<void> {
  await Print.printAsync({ html });
}
