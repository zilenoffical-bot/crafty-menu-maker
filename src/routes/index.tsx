import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpenText,
  CircleHelp,
  Clock3,
  Gamepad2,
  LogOut,
  MapPinned,
  Music2,
  Newspaper,
  Settings,
  ShieldCheck,
  UsersRound,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ElementType } from "react";
import cityImage from "@/assets/szcode-city.jpg";
import playersImage from "@/assets/tile-players.jpg";
import settingsImage from "@/assets/tile-settings.jpg";
import newsImage from "@/assets/tile-news.jpg";
import rulesImage from "@/assets/tile-rules.jpg";
import mapImage from "@/assets/tile-map.jpg";
import helpImage from "@/assets/tile-help.jpg";
import returnImage from "@/assets/tile-return.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SzCode Pause Menu | FiveM UI" },
      {
        name: "description",
        content: "Egyedi, képes rácsrendszerű FiveM pause menu SzCode fejlesztésében.",
      },
      { property: "og:title", content: "SzCode Pause Menu | FiveM UI" },
      {
        property: "og:description",
        content: "Egyedi, képes rácsrendszerű FiveM pause menu SzCode fejlesztésében.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tile = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: ElementType;
  area: string;
  image: string;
  accent?: boolean;
  position?: string;
};

const tiles: Tile[] = [
  {
    id: "players",
    title: "Játékosok",
    eyebrow: "Közösség",
    description: "128 játékos online",
    icon: UsersRound,
    area: "tile-players",
    image: playersImage,
    position: "object-left",
  },
  {
    id: "settings",
    title: "Beállítások",
    eyebrow: "Személyre szabás",
    description: "Grafika, hang és irányítás",
    icon: Settings,
    area: "tile-settings",
    image: settingsImage,
  },
  {
    id: "news",
    title: "Hírek",
    eyebrow: "Szerverinfó",
    description: "Megérkezett a Night Shift frissítés",
    icon: Newspaper,
    area: "tile-news",
    image: newsImage,
    position: "object-right",
  },
  {
    id: "rules",
    title: "Szabályzat",
    eyebrow: "Kötelező olvasmány",
    description: "Játssz tisztán. Maradj karakterben.",
    icon: BookOpenText,
    area: "tile-rules",
    image: rulesImage,
  },
  {
    id: "map",
    title: "Térkép",
    eyebrow: "Los Santos",
    description: "Helyszínek és útvonalak",
    icon: MapPinned,
    area: "tile-map",
    image: mapImage,
    accent: true,
    position: "object-center",
  },
  {
    id: "help",
    title: "Segítség",
    eyebrow: "Információ",
    description: "Parancsok és gyakori kérdések",
    icon: CircleHelp,
    area: "tile-help",
    image: helpImage,
  },
  {
    id: "return",
    title: "Vissza a játékba",
    eyebrow: "Folytatás",
    description: "ESC billentyűvel is bezárható",
    icon: Gamepad2,
    area: "tile-return",
    image: returnImage,
    accent: true,
  },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [active, setActive] = useState<Tile | null>(null);
  const [time, setTime] = useState("18:33");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(35);
  const [isFiveM, setIsFiveM] = useState(false);

  const sendToFiveM = (eventName: string, data: Record<string, unknown> = {}) => {
    const parent = (window as Window & { GetParentResourceName?: () => string }).GetParentResourceName;
    if (typeof parent !== "function") return;
    void fetch(`https://${parent()}/${eventName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    setIsFiveM(typeof (window as Window & { GetParentResourceName?: () => string }).GetParentResourceName === "function");
  }, []);

  const playMenuSound = (tone: "select" | "close" = "select") => {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(tone === "select" ? 620 : 330, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.11);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.addEventListener("ended", () => void context.close());
  };

  useEffect(() => {
    const updateTime = () =>
      setTime(new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (active) setActive(null);
        else setMenuOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    if (!menuOpen) return;
    playMenuSound("select");
    sendToFiveM("menuOpened", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  const chooseTile = (tile: Tile) => {
    playMenuSound(tile.id === "return" ? "close" : "select");
    if (tile.id === "return") {
      sendToFiveM("closePauseMenu");
      setMenuOpen(false);
    } else {
      sendToFiveM("openSection", { section: tile.id });
      setActive(tile);
    }
  };

  return (
    <main
      className={cn(
        "relative min-h-screen overflow-hidden text-foreground",
        isFiveM ? "bg-transparent" : "bg-background",
      )}
    >
      {!isFiveM && (
        <img
          src={cityImage}
          alt="Esti panoráma a fiktív Los Santos városáról"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className={cn("absolute inset-0", isFiveM ? "bg-black/45" : "bg-scene-wash")}
        aria-hidden="true"
      />

      {!menuOpen ? (
        <div className="relative z-10 grid min-h-screen place-items-center px-6">
          <div className="text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-scene-muted">Játék folytatva</p>
            <Button onClick={() => setMenuOpen(true)}>
              <Gamepad2 aria-hidden="true" /> Pause menu megnyitása
            </Button>
          </div>
        </div>
      ) : (
        <section className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
          <header className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary font-display text-xl font-black text-primary-foreground">S</div>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-bold uppercase sm:text-xl">SzCode Roleplay</h1>
                <p className="truncate font-mono text-[10px] uppercase text-muted-foreground">Pause interface / v2.4</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 sm:flex">
                <span className="size-2 rounded-full bg-status" />
                <span className="font-mono text-[11px] uppercase text-muted-foreground">128 / 256</span>
              </div>
              <Button variant="icon" aria-label="Menühang ki- vagy bekapcsolása" title="Menühang" onClick={() => { const next = !soundEnabled; setSoundEnabled(next); sendToFiveM("setMenuSound", { enabled: next }); playMenuSound(); }}>
                {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              </Button>
              <Button variant="icon" aria-label="Menü bezárása" title="Menü bezárása" onClick={() => { playMenuSound("close"); sendToFiveM("closePauseMenu"); setMenuOpen(false); }}>
                <X aria-hidden="true" />
              </Button>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center py-5 sm:py-7">
            <div className="pause-grid w-full">
              {tiles.map((tile, index) => {
                const Icon = tile.icon;
                return (
                  <Button
                    key={tile.id}
                    variant="ghost"
                    onClick={() => chooseTile(tile)}
                    className={cn(
                      tile.area,
                      "group tile-enter relative h-auto min-h-32 w-full justify-start overflow-hidden rounded-md border border-border bg-tile p-0 text-left text-foreground shadow-tile hover:border-primary hover:bg-tile-active focus-visible:border-primary sm:min-h-0",
                    )}
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <img
                      src={tile.image}
                      alt=""
                      width={1024}
                      height={768}
                      loading="lazy"
                      className={cn("absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-65", tile.position)}
                    />
                    <div className="absolute inset-0 bg-tile-wash" aria-hidden="true" />
                    <div className="relative flex h-full w-full flex-col justify-between p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-md border border-border bg-icon text-muted-foreground transition group-hover:border-primary group-hover:text-primary", tile.accent && "border-primary text-primary")}>
                          <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <ArrowLeft className="rotate-180 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" size={18} aria-hidden="true" />
                      </div>
                      <div className="mt-5 min-w-0">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-primary">{tile.eyebrow}</p>
                        <h2 className="mt-1 truncate font-display text-lg font-bold uppercase sm:text-xl">{tile.title}</h2>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{tile.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <footer className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-t border-border pt-4">
            <div className="flex min-w-0 items-center gap-3">
              <ShieldCheck className="shrink-0 text-primary" size={18} aria-hidden="true" />
              <p className="truncate font-mono text-[10px] uppercase text-muted-foreground">Fejlesztette: <span className="text-foreground">SzCode</span></p>
            </div>
            <div className="flex shrink-0 items-center gap-4 font-mono text-[10px] uppercase text-muted-foreground">
              <span className="hidden items-center gap-1.5 sm:flex"><Zap size={13} className="text-primary" /> 22 ms</span>
              <span className="flex items-center gap-1.5"><Clock3 size={13} /> {time}</span>
            </div>
          </footer>
        </section>
      )}

      {active && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-modal px-5" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div className="w-full max-w-lg rounded-md border border-border bg-panel p-6 shadow-panel animate-detail-in sm:p-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{active.eyebrow}</p>
                <h2 id="detail-title" className="mt-2 truncate font-display text-3xl font-black uppercase">{active.title}</h2>
              </div>
              <Button variant="icon" aria-label="Részletek bezárása" title="Bezárás" onClick={() => setActive(null)}><X /></Button>
            </div>
            <div className="my-6 h-px bg-border" />
            <p className="text-sm leading-6 text-muted-foreground">{active.description}. Ez a felület készen áll a FiveM események és saját adatok bekötésére.</p>
            {active.id === "settings" && (
              <div className="mt-6 rounded-md border border-border bg-icon p-4">
                <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <label htmlFor="music-volume" className="flex min-w-0 items-center gap-2 text-sm font-medium">
                    <Music2 className="shrink-0 text-primary" size={18} aria-hidden="true" />
                    <span className="truncate">Zenei hangerő</span>
                  </label>
                  <span className="font-mono text-xs text-primary">{musicVolume}%</span>
                </div>
                <input
                  id="music-volume"
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(event) => {
                    const nextVolume = Number(event.target.value);
                    setMusicVolume(nextVolume);
                    sendToFiveM("setMusicVolume", { volume: nextVolume / 100 });
                  }}
                  className="volume-slider w-full"
                />
                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <span className="text-sm text-muted-foreground">Menü hangjelzések</span>
                  <Button variant="icon" aria-label="Menühang ki- vagy bekapcsolása" onClick={() => { const next = !soundEnabled; setSoundEnabled(next); sendToFiveM("setMenuSound", { enabled: next }); }}>
                    {soundEnabled ? <Volume2 /> : <VolumeX />}
                  </Button>
                </div>
              </div>
            )}
            <Button className="mt-7" onClick={() => { playMenuSound("close"); setActive(null); }}>Rendben</Button>
          </div>
        </div>
      )}
    </main>
  );
}
