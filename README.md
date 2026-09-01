# 🌍 World Channel

Aplicativo de **canais de TV ao vivo do mundo todo**, sintonizando a lista pública
[iptv-org](https://iptv-org.github.io/iptv/index.m3u).

Feito em **React + Vite + Tailwind CSS**, empacotado como app nativo com
**Capacitor** e compilado no **Codemagic**.

> **Sem cadastro e sem login.** Favoritos e preferências ficam salvos apenas no
> dispositivo do usuário (`localStorage`).

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| **Grade mundial** | Milhares de canais abertos, carregados direto do M3U do iptv-org |
| **Filmes & Séries** | Categorias à parte, detectadas por `group-title` + heurística multi-idioma |
| **Categorias** | Notícias, Esportes, Música, Infantil, Documentários, Animação… |
| **Países** | Navegação por região, com nomes traduzidos |
| **Busca** | Por nome do canal, país, categoria ou idioma |
| **Favoritos** | Salvos localmente, sem conta |
| **Player ao vivo** | HLS via `hls.js`, com buffering, retry automático e tela cheia |
| **Layout premium** | Inspirado em Prime Video (azul-marinho) e Disney+ (blocos de marca) |

### Atalhos de teclado no player

| Tecla | Ação |
|---|---|
| `Espaço` / `K` | Reproduzir ou pausar |
| `↑` / `↓` | Volume |
| `M` | Mudo |
| `F` | Tela cheia |
| `Esc` | Voltar |

---

## 🚀 Rodando localmente

Requisitos: **Node.js 20+**

```bash
npm install     # instala as dependências
npm run dev     # inicia em http://localhost:5173
npm run build   # gera o bundle de produção em dist/
npm run preview # pré-visualiza o build
```

---

## 📦 Enviando para o GitHub

Crie um repositório vazio no GitHub e rode, na pasta do projeto:

```bash
git init
git add .
git commit -m "World Channel: app de canais de TV ao vivo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/world-channel.git
git push -u origin main
```

> **Dica:** rode `npm install` uma vez antes do commit para gerar o
> `package-lock.json` e versione esse arquivo. Ele trava as versões exatas das
> dependências e deixa o build do Codemagic mais rápido e reprodutível.
> (O pipeline funciona sem ele, mas com o lockfile é melhor.)

> As pastas `android/` e `ios/` estão no `.gitignore` porque o Codemagic
> as gera automaticamente. Veja *Personalizando o app nativo* abaixo se
> quiser versioná-las.

---

## ⚙️ Compilando no Codemagic

O arquivo [`codemagic.yaml`](./codemagic.yaml) já está pronto na raiz do
projeto, com três workflows.

### 1. Conectar o repositório

1. Acesse [codemagic.io](https://codemagic.io) e faça login com o GitHub.
2. **Add application → GitHub →** selecione o repositório `world-channel`.
3. Em tipo de projeto, escolha **Other** (o Codemagic detecta o `codemagic.yaml`).

### 2. Escolher o workflow

| Workflow | O que gera | Máquina |
|---|---|---|
| `web-build` | Site estático em `dist/` | Linux |
| `android-build` | **APK + AAB** | Linux |
| `ios-build` | App iOS (`.app` / `.ipa`) | Mac mini M2 |

Clique em **Start new build**, selecione o workflow e aguarde.

### 3. Assinatura do Android (opcional, para publicar na Play Store)

Sem keystore o build sai em **debug** (instalável para testes). Para gerar um
**release assinado**:

1. Gere um keystore, caso ainda não tenha:
   ```bash
   keytool -genkey -v -keystore worldchannel.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias worldchannel
   ```
2. No Codemagic: **Teams → Code signing identities → Android keystores** e faça
   o upload do `.jks`.
3. Crie o grupo de variáveis **`keystore_credentials`** (já referenciado no
   YAML) com:

   | Variável | Valor |
   |---|---|
   | `CM_KEYSTORE_PATH` | caminho do keystore enviado |
   | `CM_KEYSTORE_PASSWORD` | senha do keystore |
   | `CM_KEY_ALIAS` | alias da chave |
   | `CM_KEY_PASSWORD` | senha da chave |

### 4. Assinatura do iOS (opcional)

Conecte a integração **App Store Connect** em *Teams → Integrations* e ative o
code signing automático no workflow `ios-build`.

### 5. Baixar o resultado

Ao final do build, os artefatos (`.apk`, `.aab`, `.app`) ficam disponíveis na
aba **Artifacts** e são enviados por e-mail conforme a seção `publishing`.

---

## 🎨 Personalizando o app nativo

Para trocar ícone, splash screen, nome ou permissões, gere as pastas nativas
localmente:

```bash
npm run build
npx cap add android      # e/ou: npx cap add ios
npx cap sync
```

Depois remova `android/` e `ios/` do `.gitignore` e faça o commit — o Codemagic
passará a usar as suas versões personalizadas.

Identidade do app (em `capacitor.config.ts`):

- **appId:** `com.worldchannel.app`
- **appName:** `World Channel`

> ℹ️ **Sobre streams HTTP:** boa parte dos canais públicos ainda é servida em
> `http://`. Por isso `allowMixedContent` e `cleartext` estão habilitados no
> `capacitor.config.ts` — sem eles o WebView do Android bloquearia a reprodução.

---

## 🗂️ Estrutura do projeto

```
├── codemagic.yaml           # pipelines de CI/CD (web, android, ios)
├── capacitor.config.ts      # configuração do app nativo
├── index.html
└── src/
    ├── App.tsx              # rotas e páginas
    ├── index.css            # design system (tema azul-marinho)
    ├── context/
    │   └── StreamContext.tsx  # estado global (canais, player, favoritos)
    ├── data/
    │   ├── iptv.ts          # download + parser do M3U, países e categorias
    │   └── cinema.ts        # classificador de canais de Filmes e Séries
    ├── lib/
    │   └── storage.ts       # persistência local (sem login)
    └── components/
        ├── Hero.tsx           # destaque rotativo (estilo Prime Video)
        ├── BrandTiles.tsx     # blocos de marca (estilo Disney+)
        ├── ChannelCard.tsx    # cartão de canal
        ├── ChannelRow.tsx     # carrossel horizontal
        ├── ChannelGrid.tsx    # grade paginada
        ├── CinemaView.tsx     # hub de Filmes & Séries
        ├── Player.tsx         # player HLS ao vivo
        ├── Navbar.tsx / Footer.tsx
        └── StatusScreens.tsx  # carregando / erro
```

---

## 🔁 Trocando a fonte de canais

Toda a integração fica isolada em `src/data/iptv.ts`. Basta alterar a
constante `SOURCES` para apontar para outra playlist M3U — o resto do app
continua funcionando sem alterações:

```ts
const SOURCES = [
  "https://iptv-org.github.io/iptv/index.m3u",
  "https://cdn.jsdelivr.net/gh/iptv-org/iptv@master/index.m3u",
];
```

O parser entende os atributos padrão `tvg-logo`, `tvg-country`,
`tvg-language` e `group-title`.

---

## ⚠️ Aviso

O World Channel **não hospeda nem redistribui** nenhum conteúdo. O aplicativo
apenas lê uma lista pública de endereços de transmissão mantida pela comunidade
[iptv-org](https://github.com/iptv-org/iptv) e os reproduz no player do
dispositivo. A disponibilidade de cada canal depende exclusivamente da emissora
de origem — por isso alguns podem estar fora do ar a qualquer momento.

Verifique a legislação local e os direitos de transmissão antes de distribuir
o aplicativo publicamente.

---

## 📄 Licença

Código sob licença **MIT** — use, modifique e distribua livremente.
