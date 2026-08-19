import { useEffect, useMemo, useState } from "react";
import Wallpaper from "./Common/Components/Wallpaper/Wallpaper";
import { injectAssetCssVariables } from "./Services/wallpaper";

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
}

interface ProjectCopy {
  eyebrow: string;
  description: string;
}

const PROJECT_COPY: Record<string, ProjectCopy> = {
  ModularKit: {
    eyebrow: "Java toolkit",
    description: "A lightweight alternative to OSGi for building modular Java applications.",
  },
  "ModularKit-Web": {
    eyebrow: "Developer resource",
    description: "The web home and documentation surface for the ModularKit ecosystem.",
  },
};

const NUKAWORKS_LOGO_URL =
  "https://nwrks-cdn.public.prod.nuka.works/static/logo_nwrks.png";

const FALLBACK_REPOS: GitHubRepo[] = Object.keys(PROJECT_COPY).map((name) => ({
  name,
  html_url: `https://github.com/NukaWorks/${name}`,
  description: null,
  language: name === "ModularKit" ? "Java" : "SCSS",
  pushed_at: "",
  archived: false,
  fork: false,
}));

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-9-4 12" />
    </svg>
  );
}

function BrandLogo() {
  return (
    <img
      className="company-logo"
      src={NUKAWORKS_LOGO_URL}
      alt=""
      width="378"
      height="378"
      decoding="async"
      aria-hidden="true"
    />
  );
}

function formatActivity(date: string): string {
  if (!date) return "Open source";

  return `Updated ${new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date))}`;
}

function App() {
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [githubState, setGithubState] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    document.title = "NukaWorks — Software for human connection";
    injectAssetCssVariables();

    const controller = new AbortController();

    fetch("https://api.github.com/orgs/NukaWorks/repos?type=public&sort=pushed&per_page=100", {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
        return response.json() as Promise<GitHubRepo[]>;
      })
      .then((publicRepos) => {
        const featured = publicRepos.filter(
          (repo) => PROJECT_COPY[repo.name] && !repo.archived && !repo.fork
        );

        if (featured.length > 0) {
          setRepos(featured);
          setGithubState("live");
        } else {
          setGithubState("fallback");
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setGithubState("fallback");
      });

    return () => controller.abort();
  }, []);

  const featuredRepos = useMemo(
    () =>
      Object.keys(PROJECT_COPY)
        .map((name) => repos.find((repo) => repo.name === name))
        .filter((repo): repo is GitHubRepo => Boolean(repo)),
    [repos]
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the work
      </a>
      <Wallpaper />

      <div className="company-site">
        <header className="company-header">
          <div className="company-frame company-header-inner">
            <a className="company-brand" href="#top" aria-label="NukaWorks home">
              <BrandLogo />
              <span className="company-wordmark">
                <strong>Nuka</strong>Works
              </span>
            </a>

            <nav className="company-nav" aria-label="Primary navigation">
              <a href="#work">work</a>
              <a href="#vision">vision</a>
              <a href="#studio">studio</a>
            </nav>

            <a
              className="company-header-link"
              href="https://github.com/NukaWorks"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ArrowIcon />
            </a>
          </div>
        </header>

        <main id="main">
          <section className="company-frame hero" id="top" aria-labelledby="hero-title">
            <div className="hero-kicker">
              <span className="status-dot" />
              Independent software company · France
            </div>

            <div className="hero-heading-row">
              <h1 id="hero-title">
                Software for
                <span>human connection.</span>
              </h1>
              <p className="hero-intro">
                NukaWorks creates social products and open tools for the people on both sides of
                the screen.
              </p>
            </div>

            <div className="hero-actions">
              <a className="metro-button metro-button-primary" href="#work">
                Explore our work
                <span aria-hidden="true">↓</span>
              </a>
              <a className="metro-button" href="#vision">
                Read our direction
              </a>
            </div>

            <div className="hero-ticker" aria-label="NukaWorks focus areas">
              <span>01 / social products</span>
              <span>02 / open source</span>
              <span>03 / long-term thinking</span>
            </div>
          </section>

          <section className="company-frame section work-section" id="work" aria-labelledby="work-title">
            <div className="section-heading">
              <p className="section-number">01</p>
              <div>
                <p className="section-kicker">Selected work</p>
                <h2 id="work-title">Things we make.</h2>
              </div>
              <p className="section-lede">
                From creator marketplaces to modular developer infrastructure, our work is united
                by one idea: useful software should make complex relationships feel simple.
              </p>
            </div>

            <div className="work-grid">
              <a
                className="metro-tile metro-tile-moggo"
                href="https://www.moggo.fr/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="tile-topline">
                  <span>Flagship product</span>
                  <ArrowIcon />
                </div>
                <div className="moggo-symbol" aria-hidden="true">
                  m
                </div>
                <div className="tile-copy">
                  <p className="tile-index">01 / Live platform</p>
                  <h3>Moggo</h3>
                  <p>
                    A UGC marketplace that helps brands and verified creators find each other,
                    collaborate and deliver work without the usual friction.
                  </p>
                </div>
              </a>

              <div className="open-source-panel">
                <div className="open-source-header">
                  <div>
                    <p className="section-kicker">Built in the open</p>
                    <h3>Open source, on purpose.</h3>
                  </div>
                  <span className={`api-status api-status-${githubState}`} aria-live="polite">
                    <span />
                    {githubState === "live" ? "Live GitHub data" : "GitHub projects"}
                  </span>
                </div>

                <div className="repo-list">
                  {featuredRepos.map((repo, index) => {
                    const copy = PROJECT_COPY[repo.name]!;
                    return (
                      <a
                        className="repo-row"
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        key={repo.name}
                      >
                        <span className="repo-index">0{index + 2}</span>
                        <span className="repo-icon">
                          <CodeIcon />
                        </span>
                        <span className="repo-copy">
                          <span className="repo-eyebrow">{copy.eyebrow}</span>
                          <strong>{repo.name}</strong>
                          <span>{repo.description || copy.description}</span>
                        </span>
                        <span className="repo-meta">
                          <span>{repo.language || "Source"}</span>
                          <span>{formatActivity(repo.pushed_at)}</span>
                        </span>
                        <ArrowIcon />
                      </a>
                    );
                  })}
                </div>

                <a
                  className="text-link"
                  href="https://github.com/NukaWorks"
                  target="_blank"
                  rel="noreferrer"
                >
                  See the whole organization <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>

          <section className="vision-section" id="vision" aria-labelledby="vision-title">
            <div className="company-frame">
              <div className="section-heading section-heading-light">
                <p className="section-number">02</p>
                <div>
                  <p className="section-kicker">Our direction</p>
                  <h2 id="vision-title">Build what should exist.</h2>
                </div>
                <p className="section-lede">
                  We are here to make the internet feel more useful, more open and a little more
                  human than we found it.
                </p>
              </div>

              <div className="principles-grid">
                <article className="principle principle-featured">
                  <span className="principle-number">01</span>
                  <div>
                    <h3>Social that feels social.</h3>
                    <p>
                      Products built around participation, trust and real exchange—not engagement
                      for engagement’s sake.
                    </p>
                  </div>
                </article>
                <article className="principle">
                  <span className="principle-number">02</span>
                  <div>
                    <h3>Tools that stay open.</h3>
                    <p>
                      Share the foundations. Let developers inspect, learn from and extend the
                      systems they depend on.
                    </p>
                  </div>
                </article>
                <article className="principle">
                  <span className="principle-number">03</span>
                  <div>
                    <h3>Software with a long view.</h3>
                    <p>
                      Small, durable systems; clear decisions; and technology chosen to serve the
                      product rather than the trend cycle.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="company-frame section studio-section" id="studio" aria-labelledby="studio-title">
            <div className="section-heading studio-heading">
              <p className="section-number">03</p>
              <div>
                <p className="section-kicker">The studio</p>
                <h2 id="studio-title">Independent by design.</h2>
              </div>
            </div>

            <div className="founder-grid">
              <div className="founder-monogram" aria-hidden="true">
                emi<span>.</span>
              </div>
              <div className="founder-copy">
                <p className="founder-role">Founder &amp; developer · powerm1nt</p>
                <h3>NukaWorks is run by Emi.</h3>
                <p>
                  An independent software maker working across product, engineering and the odd
                  ambitious idea that refuses to stay on paper.
                </p>
                <div className="founder-links">
                  <a href="https://github.com/powerm1nt" target="_blank" rel="noreferrer">
                    GitHub <ArrowIcon />
                  </a>
                  <a href="https://developer.nuka.works/team/powerm1nt" target="_blank" rel="noreferrer">
                    More about Emi <ArrowIcon />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="company-frame contact-section" aria-labelledby="contact-title">
            <p className="section-kicker">What’s next?</p>
            <h2 id="contact-title">Let’s make the next useful thing.</h2>
            <p>Follow the work, explore the code, or come back when the next experiment ships.</p>
            <a
              className="metro-button metro-button-primary"
              href="https://github.com/NukaWorks"
              target="_blank"
              rel="noreferrer"
            >
              Follow NukaWorks
              <ArrowIcon />
            </a>
          </section>
        </main>

        <footer className="company-footer">
          <div className="company-frame company-footer-inner">
            <a className="company-brand" href="#top" aria-label="Back to top">
              <BrandLogo />
              <span className="company-wordmark">
                <strong>Nuka</strong>Works
              </span>
            </a>
            <p>Software for human connection.</p>
            <p>© {new Date().getFullYear()} NukaWorks Corporation</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
