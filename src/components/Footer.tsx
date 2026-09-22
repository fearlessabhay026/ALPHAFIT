import { brand, contact, footer, navigation } from '../data/site';
import { scrollToId } from '../lib/useSmoothScroll';
import { Wordmark } from './ui/Wordmark';

/**
 * Footer — deliberately light. Contact details are placeholders until the real
 * ones exist; each unresolved entry is rendered as plain text with a marker
 * rather than as a link that would go nowhere.
 */
export function Footer() {
  const details = [contact.location, contact.instagram, contact.whatsapp];

  return (
    <footer className="border-t border-iron/60 bg-ink">
      <div className="gutter mx-auto max-w-[120rem] py-14 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark className="text-[1.1rem]" />
            <p className="body-type mt-7 max-w-xs text-[0.88rem] text-ash">{brand.signoff}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 md:gap-x-16">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="label-type text-smoke">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          if (event.metaKey || event.ctrlKey) return;
                          event.preventDefault();
                          scrollToId(item.href);
                        }}
                        className="body-type text-[0.9rem] text-bone transition-colors duration-300 hover:text-red"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-2">
              <h2 className="label-type text-smoke">Contact</h2>
              <ul className="mt-5 space-y-3">
                {details.map((detail) => (
                  <li key={detail.label} className="flex flex-wrap items-baseline gap-x-3">
                    <span className="label-type text-smoke">{detail.label}</span>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="body-type text-[0.9rem] text-bone transition-colors duration-300 hover:text-red"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span className="body-type text-[0.9rem] text-ash">
                        {detail.value}
                        {detail.placeholder && (
                          <span className="label-type ml-2 text-red/80">placeholder</span>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-iron/60 pt-7 md:flex-row md:items-center md:justify-between">
          <p className="label-type text-smoke">{brand.tagline}</p>
          <p className="label-type text-smoke">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
