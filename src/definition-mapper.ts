import { MkDocs, NavItem } from './mkdocs-definition';
export interface MkDocsYaml {
  siteName: string;
  nav?: Array<NavItemYaml | string>;
  plugins: string[];
}

export interface NavItemYaml {
  [key: string]: string | Array<NavItemYaml | string>;
}

export function transform(mkdocs: MkDocs): MkDocsYaml {
  let mk: MkDocsYaml = {
    siteName: mkdocs.siteName,
    plugins: mkdocs.plugins,
    ...(mkdocs.nav && {
      nav: mkdocs.nav?.map(c => transformNavItem(c)),
    }),
  };
  return mk;
}

function transformNavItem(navItem: NavItem): NavItemYaml | string {
  if (navItem.children !== undefined && navItem.children.length > 0) {
    if (navItem.name === undefined) {
      console.log('Nav item should have either children or a name');
      throw new Error('Nav item should have either children or a name');
    }
    return {
      [navItem.name]: navItem.children.map(c => transformNavItem(c)),
    } as NavItemYaml;
  } else {
    if (navItem.name) {
      return {
        [navItem.name]: navItem.uri,
      } as NavItemYaml;
    } else {
      if (navItem.uri === undefined) {
        console.log('Nav item should have either uri or a name');
        throw new Error('Nav item should have either uri or a name');
      }
      return navItem.uri;
    }
  }
}