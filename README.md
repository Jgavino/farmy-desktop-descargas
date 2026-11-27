# Farmy para Windows · descargas

Instaladores de la app de escritorio de [Farmy](https://farmyperu.com), el sistema para boticas y farmacias del Perú.

**Descargar la última versión:** [Farmy-Windows.exe](https://github.com/Jgavino/farmy-desktop-descargas/releases/latest/download/Farmy-Windows.exe)

- Se instala sin permisos de administrador.
- Windows puede mostrar «Windows protegió su PC»: **Más información › Ejecutar de todas formas**.
- Desde la versión 1.2.0, Farmy se actualiza sola: descarga la versión nueva mientras trabajas y la instala al cerrar Farmy.

Este repositorio solo guarda los instaladores (en *Releases*). El código de Farmy no está aquí.

## Publicar una versión (equipo de Farmy)

1. En `app-saas-farmy`, sube la versión en `src-tauri/tauri.conf.json` y `src-tauri/Cargo.toml` y haz el merge a `main`.
2. Aquí: **Actions › Publicar Farmy para Windows › Run workflow**, con la rama `main`, **publicar** marcado y, si quieres, las notas.
3. En unos 15 minutos queda la versión en *Releases*. Las PC con Farmy la descargan solas (revisan al minuto de abrir y cada 6 horas) y la instalan al cerrar Farmy.

Sin marcar **publicar**, solo arma el instalador para probarlo (queda como artefacto de la ejecución). Sirve para probar una rama antes del merge.

Secretos (Settings › Secrets and variables › Actions):

| Secreto | Qué es |
|---|---|
| `FARMY_APP_TOKEN` | Token fine-grained solo para `app-saas-farmy`, permiso *Contents: Read-only* |
| `TAURI_SIGNING_PRIVATE_KEY` | Contenido de `farmy.key`, la llave que firma las actualizaciones |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Contraseña de esa llave |

La llave pública está en `tauri.conf.json` (`plugins.updater.pubkey`). La app rechaza cualquier actualización que no esté firmada con su llave privada. Si se pierde la llave privada, las PC instaladas ya no podrán actualizarse solas y habrá que reinstalar a mano.
