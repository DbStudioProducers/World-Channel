import { Logo } from "./Logo";

const LINKS: Record<string, string[]> = {
  Plataforma: ["Início", "Canais", "Categorias", "Países", "Favoritos"],
  Suporte: ["Central de ajuda", "Dispositivos compatíveis", "Acessibilidade", "Fale conosco"],
  Legal: ["Termos de uso", "Privacidade", "Cookies", "Avisos"],
};

export function Footer() {
  return (
    <footer className="safe-bottom mt-16 border-t border-white/[0.07] bg-[#0e1526] pb-28 pt-12 md:pb-12">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Canais de TV ao vivo do mundo inteiro, direto no seu navegador —{" "}
              <span className="text-white/70">sem cadastro e sem login.</span>
            </p>
          </div>
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-display text-sm font-bold text-white">{group}</h4>
              <ul className="mt-3 space-y-2">
                {items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-white/45 transition hover:text-sky-400">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} World Channel · Catálogo iptv-org (https://iptv-org.github.io/iptv/index.m3u)
          </p>
          <p className="text-xs text-white/35">
            Feito com <span className="text-cyan-400">♥</span> para quem ama TV
          </p>
        </div>
      </div>
    </footer>
  );
}
