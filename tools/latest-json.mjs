// Prepara los archivos de una versión de Farmy para Windows:
//   Farmy_X.Y.Z_x64-setup.exe  el instalador (lo que descarga la app para actualizarse)
//   Farmy-Windows.exe          el mismo instalador con nombre fijo, para el enlace «Descargar para Windows»
//   latest.json                lo que revisa la app para saber si hay una versión nueva (con la firma)
//
// Uso: node tools/latest-json.mjs <carpeta-nsis> <version> <carpeta-salida>
// Variables: GITHUB_REPOSITORY (dueño/repo de las descargas), NOTAS (qué cambia; opcional)
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function latestJson({ version, firma, repo, notas, fecha = new Date() }) {
  const instalador = `Farmy_${version}_x64-setup.exe`;
  return {
    version,
    notes: notas?.trim() || `Farmy ${version} para Windows.`,
    pub_date: fecha.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    platforms: {
      'windows-x86_64': {
        signature: firma.trim(),
        url: `https://github.com/${repo}/releases/download/v${version}/${instalador}`,
      },
    },
  };
}

function main([nsis, version, salida]) {
  if (!nsis || !version || !salida) throw new Error('Uso: node tools/latest-json.mjs <carpeta-nsis> <version> <carpeta-salida>');
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Versión no válida: ${version}`);
  const repo = process.env.GITHUB_REPOSITORY || 'Jgavino/farmy-desktop-descargas';
  const instalador = `Farmy_${version}_x64-setup.exe`;
  const exe = join(nsis, instalador);
  if (!existsSync(exe)) throw new Error(`No está el instalador ${exe}: ¿la versión de tauri.conf.json es ${version}?`);
  if (!existsSync(`${exe}.sig`)) throw new Error(`No está la firma ${exe}.sig: revisa los secretos TAURI_SIGNING_PRIVATE_KEY y TAURI_SIGNING_PRIVATE_KEY_PASSWORD`);

  mkdirSync(salida, { recursive: true });
  copyFileSync(exe, join(salida, instalador));
  copyFileSync(exe, join(salida, 'Farmy-Windows.exe'));
  const json = latestJson({ version, firma: readFileSync(`${exe}.sig`, 'utf8'), repo, notas: process.env.NOTAS });
  writeFileSync(join(salida, 'latest.json'), JSON.stringify(json, null, 2) + '\n');
  console.log(`Farmy ${version}: ${instalador}, Farmy-Windows.exe y latest.json en ${salida}`);
}

if (process.argv[1]?.endsWith('latest-json.mjs')) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(`::error::${e.message}`); process.exit(1); }
}
