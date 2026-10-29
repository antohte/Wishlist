"""Initialise local admin credentials without writing a plaintext password."""
import getpass, hashlib, secrets
from pathlib import Path
if any(Path(name).exists() for name in ['.env.local', '.env.vercel']):
    raise SystemExit('Un fichier de configuration existe déjà. Aucun fichier remplacé.')
password = getpass.getpass('Mot de passe administrateur : ')
if len(password) < 8:
    raise SystemExit('Utilise au moins 8 caractères.')
salt = secrets.token_hex(16)
hashed = hashlib.scrypt(password.encode(), salt=salt.encode(), n=16384, r=8, p=1, dklen=64).hex()
config = f'ADMIN_EMAIL=antonin.hotte@gmail.com\nADMIN_PASSWORD_HASH=scrypt:{salt}:{hashed}\nSESSION_SECRET={secrets.token_hex(32)}\n'
for name, content in [('.env.local', config + 'STORAGE_MODE=local\n'), ('.env.vercel', config)]:
    path = Path(name)
    if path.exists():
        raise SystemExit(f'{name} existe déjà. Aucun fichier remplacé.')
    path.write_text(content)
    path.chmod(0o600)
print('Configuration locale et fichier privé .env.vercel créés. Aucun mot de passe en clair enregistré.')
