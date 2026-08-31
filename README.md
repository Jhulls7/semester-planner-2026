# Rumbo · Semestre 2026-II

Panel estático para el horario, las notas y la organización académica del semestre UNSCH 2026-II.

## Uso local

Abre `index.html` desde un servidor estático local. El acceso usa el PIN `0000` con un teclado visual de cuatro dígitos; la opción de recordar el navegador permite entrar directamente en ese perfil. El contenido personal se cifra con Web Crypto (PBKDF2 + AES-GCM) y se guarda en el navegador.

Los cuatro sílabos de ingeniería solo exponen `IUPP 100%` sin desglose de criterios; la calculadora los deja como plantilla editable. PS-182 sí carga `33% + 33% + 34%` según el sílabo.

## GitHub Pages

1. Sube este repositorio a GitHub.
2. En `Settings → Pages`, selecciona `GitHub Actions` como fuente.
3. El workflow `.github/workflows/pages.yml` publica la carpeta `semester-planner-2026`.

El PIN funciona como barrera de privacidad para uso personal, no como autenticación fuerte. Las tareas, notas, libros y proyectos permanecen en el navegador y no se sincronizan entre equipos. Borrar los datos del sitio elimina la bóveda local.
