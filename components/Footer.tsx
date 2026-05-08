import { Reveal } from "./Reveal";
import { SITE_CONTACT, SITE_SOCIAL } from "@/lib/site-social";

const linkClass =
  "text-[color:color-mix(in_srgb,var(--color-sand)_90%,transparent)] transition hover:text-[var(--color-shell)]";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.372-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.873v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socialNav = (
  [
    { label: "LinkedIn", href: SITE_SOCIAL.linkedin, Icon: LinkedInIcon },
    { label: "Instagram", href: SITE_SOCIAL.instagram, Icon: InstagramIcon },
    {
      label: "Facebook",
      href: SITE_SOCIAL.facebook.trim(),
      Icon: FacebookIcon,
    },
  ] satisfies { label: string; href: string; Icon: typeof LinkedInIcon }[]
).filter((item) => item.href.length > 0);

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="eyebrow border-b border-[color:color-mix(in_srgb,var(--color-sand)_15%,transparent)] pb-3 text-[var(--color-shell)]">
        {title}
      </p>
      <div className="flex flex-col gap-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[color:color-mix(in_srgb,var(--color-sand)_12%,transparent)] bg-[var(--color-deep-sea)] py-14 text-[var(--color-sand)] sm:py-16">
      <div className="section-wrap">
        <Reveal>
          <div className="mx-auto grid max-w-6xl gap-10 sm:gap-11 md:grid-cols-2 md:gap-x-10 md:gap-y-11 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 xl:gap-x-12">
            <FooterColumn title="Profile">
              <p className="font-heading text-xl text-[var(--color-shell)]">Coleman Crozier</p>
              <p className={linkClass}>Melbourne Beach, FL</p>
            </FooterColumn>

            <FooterColumn title="On this page">
              <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
                <a className={`w-fit text-xs font-medium tracking-[0.12em] ${linkClass}`} href="#about">
                  About
                </a>
                <a className={`w-fit text-xs font-medium tracking-[0.12em] ${linkClass}`} href="#work">
                  Work
                </a>
                <a className={`w-fit text-xs font-medium tracking-[0.12em] ${linkClass}`} href="#home">
                  Top
                </a>
              </nav>
            </FooterColumn>

            <FooterColumn title="Contact">
              <a href={`tel:${SITE_CONTACT.phone.tel}`} className={`w-fit ${linkClass}`}>
                {SITE_CONTACT.phone.display}
              </a>
              <ul className="flex flex-col gap-2.5">
                {SITE_CONTACT.emails.map((address) => (
                  <li key={address} className="min-w-0 break-words">
                    <a href={`mailto:${address}`} className={`${linkClass} inline`}>
                      {address}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Social">
              <ul className="flex flex-row flex-wrap gap-3">
                {socialNav.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in new tab)`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--color-sand)_16%,transparent)] bg-[color:color-mix(in_srgb,var(--color-shell)_5%,transparent)] text-[var(--color-canopy)] transition hover:border-[var(--color-moss)] hover:text-[var(--color-moss)]"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <p className="mx-auto mt-12 max-w-6xl border-t border-[color:color-mix(in_srgb,var(--color-sand)_10%,transparent)] pt-8 text-center text-xs text-[color:color-mix(in_srgb,var(--color-sand)_40%,transparent)]">
            © {new Date().getFullYear()} Coleman Crozier
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
