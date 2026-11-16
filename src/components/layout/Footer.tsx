import { footer, site } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { credit } = footer;
  return (
    <footer className="border-t border-border px-4 pt-16 pb-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-x-6 gap-y-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-3 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-[14px] text-muted">{site.tagline}</p>
          </div>
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[13px] font-semibold text-fg">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[14px] text-muted transition-colors hover:text-fg">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>
          <p>
            {credit.before} <strong className="font-semibold text-fg">{credit.name}</strong>
            {credit.after}{" "}
            <a href={credit.link.href} className="font-medium text-fg underline-offset-4 hover:underline">
              {credit.link.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
