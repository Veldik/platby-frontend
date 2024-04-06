# platby frontend

Frontend ve Svelte k platebnímu systému.  
Backend je v repozitáři [platby](https://github.com/veldik/platby).

## Instalace 
Frontend platebního systému je momentálně nastaven pro nasazení na [Cloudflare Pages](https://pages.cloudflare.com/).  
Pro správné fungování je třeba nastavit proměnné prostředí. 
Ostatní nastavení je výchozí pro nasazení SvelteKit aplikace na [Cloudflare Pages](https://pages.cloudflare.com/).

### Proměnné prostředí
| proměnná | hodnota | popis |  
| --- | --- | --- |
| NODE_VERSION | 16 | verze node.js |  
| PUBLIC_API_URL | https://api.platby.thevelda.eu | adresa API |  
