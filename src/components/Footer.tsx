import { brand, footer, navigation } from '../data/site';
import { scrollToId } from '../lib/useSmoothScroll';
import { Wordmark } from './ui/Wordmark';

/**
 * Footer — deliberately light. Contact, hours and socials live in the final
 * call to action directly above, so this only closes the page: mark, sign-off,
 * navigation, legal.
 */
export function Footer() {
  return (
    <footer className="border-t border-iron/60 bg-void">
      <div className="gutter mx-auto flex max-w-[120rem] flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between md:py-14">
        <div>
          <Wordmark className="text-[1.05rem]" />
          <p className="label-type mt-6 text-smoke">{brand.signoff}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey) return;
                    event.preventDefault();
                    scrollToId(item.href);
                  }}
                  className="label-type text-ash transition-colors duration-300 hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="label-type text-smoke">{footer.legal}</p>
      </div>
    </footer>
  );
}
